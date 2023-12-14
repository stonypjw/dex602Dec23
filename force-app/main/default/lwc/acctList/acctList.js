import { LightningElement, wire } from 'lwc';
import topAccounts from '@salesforce/apex/AccountController.topAccounts';
import Id from '@salesforce/user/Id';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import {publish, MessageContext } from 'lightning/messageService';

export default class AcctList extends LightningElement {
    results;                    // property to hold the provisioned object from the wire service
    recordsToDisplay = false;   // boolean property to determine if we have records to display
    displayedAccts = [];         // array property to hold the opp records to display in the UI
    userId = Id;
    selectedId;
    selectedName;

    @wire(MessageContext)
    messageContext;

    handleSelection(event){
        this.selectedId = event.detail.prop1;
        this.selectedName = event.detail.prop2;
        this.sendMessageService(this.selectedId, this.selectedName);
    }

    sendMessageService(accountId, accountName){
        publish(this.messageContext, AccountMC, { recordId: accountId, accountName: accountName });
    }

    @wire(topAccounts, { ownerId: '$userId' })
    wiredAccts(acctRecords) {
        // move the provisioned object into a property so we can refresh the cache later
        this.results = acctRecords;

        // check to see if we got data or error
        if (this.results.data) {
            console.log('Data returned');
            console.log(this.results.data);
            this.displayedAccts = this.results.data;
            this.recordsToDisplay = true;

            this.selectedId = this.displayedAccts[0].Id;
            this.selectedName = this.displayedAccts[0].Name;
            this.sendMessageService(this.selectedId, this.selectedName);
            

        }

        if (this.results.error) {
            console.error('Error occurred retrieving account records....');
            this.recordsToDisplay = false;
        }
    };

}