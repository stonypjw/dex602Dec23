import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { subscribe, unsubscribe } from 'lightning/empApi';
import OPP_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPP_AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import OPP_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import OPP_CLOSEDATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunityList extends LightningElement {

    @api recordId;

    results;                    // property to hold the provisioned object from the wire service
    recordsToDisplay = false;   // boolean property to determine if we have records to display
    displayedOpps = [];         // array property to hold the opp records to display in the UI
    allOpps = [];               // array property to hold ALL the related opp records
    status = 'All';  
    totalRecords;
    totalAmount; 
    channelName = '/topic/OppList';   // property to hold the push topic channel name to subscribe to
    subscription = {};
    tableChecked = false;
    cardChecked = true;   
    draftValues = [];

    columns = [
        {label: 'Opportunity Name', fieldName: OPP_NAME_FIELD.fieldApiName, type: 'text' },
        {label: 'Amount', fieldName: OPP_AMOUNT_FIELD.fieldApiName, type: 'currency', editable: true },
        {label: 'Stage', fieldName: OPP_STAGE_FIELD.fieldApiName, type: 'text' },
        {label: 'Close Date', fieldName: OPP_CLOSEDATE_FIELD.fieldApiName, type: 'date', editable: true}
    ];

    @track comboOptions = [
                { value: 'All', label: 'All' },
                { value: 'Open', label: 'Open' },
                { value: 'Closed', label: 'Closed' }
             //   { value: 'ClosedWon', label: 'Closed Won' },
             //   { value: 'ClosedLost', label: 'Closed Lost' }
    ];

    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: STAGE_FIELD})
    wiredPicklist({ data, error }){
        if (data) {
            for (let item of data.values) {
                this.comboOptions.push({value: item.value, label: item.label});
            }
            this.comboOptions = this.comboOptions.slice();
        }
        if (error) {
            console.error('Error occurred retrieving picklist values....');
        }
        
    }

    @wire(getOpportunities, { accountId: '$recordId' })
    wiredOpps(oppRecords) {
        // move the provisioned object into a property so we can refresh the cache later
        this.results = oppRecords;

        // check to see if we got data or error
        if (this.results.data) {
            console.log('Data returned');
            console.log(this.results.data);
            this.allOpps = this.results.data;
            this.updateList();
        }

        if (this.results.error) {
            console.error('Error occurred retrieving opp records....');
            this.recordsToDisplay = false;
        }
    };

    //method to generate filtered list based on user selection
    updateList() {
        this.displayedOpps = [];

        let currentRecord = {};

        if (this.status === 'All'){
            this.displayedOpps = this.allOpps;
        }
        else {
            for (let i = 0; i < this.allOpps.length; i++){
                currentRecord = this.allOpps[i];
                if (this.status === 'Open' ){
                    if (!currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                }
                else if (this.status === 'Closed' ){
                    if (currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                }
                else if (this.status === currentRecord.StageName ) {
                    this.displayedOpps.push(currentRecord);
                }
               // else if (this.status === 'ClosedWon' ) {
               //     if ( currentRecord.IsWon ) {
               //         this.displayedOpps.push(currentRecord);
               //     }
               // }
               // else if ( this.status === 'ClosedLost'){
               //     if ( !currentRecord.IsWon && currentRecord.IsClosed) {
               //         this.displayedOpps.push(currentRecord);
               //     }
               // }
            }
        }
        this.recordsToDisplay = this.displayedOpps.length > 0 ? true : false;

        //calculate summaries
        this.totalRecords = this.displayedOpps.length;
        this.totalAmount = this.displayedOpps.reduce((prev, curr) => prev + (isNaN(curr.Amount) ? 0 : curr.Amount), 0);
    }

    handleChange(event) {
        this.status = event.detail.value;
        console.log(this.status);
        this.updateList();
    }

    refreshList() {
        refreshApex(this.results);
    }

       // create a method to subscribe to a push topic
       handleSubscribe() {
        // callback function to execute when receiving a message on the channel
        const messageCallback = response => {
            // check for deletion event
            if (response.data.event.type === 'deleted') {
                // check to see if it is an opp we are displaying
                if (this.allOpps.find(elem => { return elem.Id === response.data.sobject.Id})) {
                    this.refreshList();
                }
            } else {        // must be created or updated or undeleted
                if (response.data.sobject.AccountId === this.recordId) {
                    this.refreshList();
                }
            }
        }

        // subscribe to push topic
        subscribe(this.channelName, -1, messageCallback)
            .then(response => { this.subscription = response });        // move subscription object into our property
    }

    // create a method to unsubscribe from a push topic
    handleUnsubscribe() {
        // unsubscribe from the channel
        unsubscribe(this.subscription, response => { console.log('Opplist unsubscribed from push topic...')});
    }

    // executed when component is inserted into the DOM
    connectedCallback() {
        this.handleSubscribe();
    }

    // executed when component is removed from the DOM
    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    handleToggle(event) {
        const selection = event.detail.value;

        if (selection === 'card') {
            this.cardChecked = true;
            this.tableChecked = false;
        }
        else if (selection === 'table') {
            this.cardChecked = false;
            this.tableChecked = true; 
        }

    }

    handleTableSave(event) {
        this.draftValues = event.detail.draftValues;
        console.log('Draft Values : '+this.draftValues);

        //convert values into input items to prepare for record update
        const inputItems = this.draftValues.slice().map(draft => {
            var fields = Object.assign({}, draft);
            return { fields };
        });

        console.log('InputItems : '+JSON.stringify(inputItems));

        //Create list of Promise objects to send via updateRecord
        const promises = inputItems.map(recordInput => updateRecord(recordInput));

        Promise.all(promises)
            .then (result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!',
                        message: 'Updates to records have been made',
                        variant: 'success'
                    })
                );
            })
            .catch( error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!',
                        message: 'Errors have been detected',
                        variant: 'error'
                    })
                );
            })
            .finally(() => {
                this.draftValues = [];
            });
                

    }
}