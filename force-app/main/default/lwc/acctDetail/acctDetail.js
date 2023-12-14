import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

export default class AcctDetail extends LightningElement {

    accountName;
    accountId;
    subscription = {};

    get detailLabel() {
        return 'Details for ' + this.accountName;
    }

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel(){
        this.subscription = subscribe(this.messageContext, AccountMC, 
                                            (message) => this.handleMessage(message));
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    handleMessage(message){
        this.accountId = message.recordId;
        this.accountName = message.accountName;
    }
}