import { LightningElement, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import creditCheckApi from '@salesforce/apexContinuation/CreditCheckContinuation.creditCheckAPI';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctCard extends LightningElement {

    @api accountId;
    @api name;
    @api accnum;
    @api revenue;
    @api phone;
    @api website;

    showContacts = false;
    loadingContacts = false;
    contacts;

    creditObj = {};

    displayContacts() {
        if (this.showContacts) {
            this.showContacts = false;
        }
        else {
            this.loadingContacts = true;

            getContactList({ accountId: this.accountId })
                .then((data) => {
                    this.contacts = data;
                    this.showContacts = true;
                })
                .catch((error) => {
                    console.error('Error retrieving contacts');
                    this.showContacts = false;
                })
                .finally(() => {
                    this.loadingContacts = false;
                });
        }
    }

    handleSelect() {
        const selectEvent = new CustomEvent('selected', { detail: { 'prop1': this.accountId, 'prop2': this.name}});
        this.dispatchEvent(selectEvent);
    }

    checkCredit() {
        console.log('Checking credit');
        creditCheckApi({ accountId: this.accountId })
            .then( response => {
                console.log(response);

                this.creditObj = JSON.parse(response);
                console.log(this.creditObj.Company_Name__c);

                var toastMessage = 'Credit check approved for ' + this.creditObj.Company_Name__c +'!';

                const toastEvent = new ShowToastEvent({
                    title: 'Credit Check Complete',
                    message: toastMessage,
                    variant: 'success',
                    mode: 'sticky'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch( error => {
                console.error(JSON.stringify(error));
            })
            .finally(() => {
                console.log('Finished credit check');
            });
    }

}