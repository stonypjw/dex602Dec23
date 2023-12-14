import { LightningElement, api } from 'lwc';

export default class MyComponent extends LightningElement {

    @api showContacts = false;

    contacts = [
        {Id: '111', Name: 'John', Title: 'VP'},
        {Id: '222', Name: 'Dagny', Title: 'SVP'},
        {Id: '333', Name: 'Henry', Title: 'President'}
    ];

    toggleView() {
        this.showContacts = !this.showContacts;
    }
}
