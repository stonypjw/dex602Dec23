import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';


export default class AcctRelated extends LightningElement {

    accountId;                  // property to hold the account ID received from the message channel
    accountName;                // property to hold the account Name received from the message channel
    subscription = {};          // property to hold the subscription object returned from subscribe

    oppLabel = 'Opportunities';     // property to hold the label for the accordian section
    caseLabel = 'Cases';            

    // getter method to display a label in the Related component
    get relatedLabel() {
        return 'Related Records for ' + this.accountName;
    }

    // method to update the opp label
    updateOppLabel(event) {
        this.oppLabel = 'Opportunities' + ' (' + event.detail + ')';
    }

    // method to update the case label
    updateCaseLabel(event) {
        this.caseLabel = 'Cases' + ' (' + event.detail + ')';
    }

    // create my MessageContext object
    @wire(MessageContext)
    messageContext;

    // create a method to subscribe to the message channel
    subscribeToMessageChannel() {
        this.subscription = subscribe(this.messageContext, AccountMC, (message) => this.handleMessage(message));
    }

    // method to handle the message channel message
    handleMessage(message) {
        this.accountId = message.recordId;
        this.accountName = message.accountName;
        console.log('acctRelated: Message received and handled: ' + this.accountId + ' ' + this.accountName);
    }

    // create a method to unsubscribe from the message channel
    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }


}