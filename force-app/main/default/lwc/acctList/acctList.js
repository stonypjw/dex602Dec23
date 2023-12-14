import { LightningElement, wire } from 'lwc';
import topAccounts from '@salesforce/apex/AccountController.topAccounts';
import Id from "@salesforce/user/Id";

export default class AcctList extends LightningElement {
    results;                    // property to hold the provisioned object from the wire service
    recordsToDisplay = false;   // boolean property to determine if we have records to display
    displayedAccts = [];         // array property to hold the opp records to display in the UI
    userId = Id;

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
        }

        if (this.results.error) {
            console.error('Error occurred retrieving opp records....');
            this.recordsToDisplay = false;
        }
    };

}