import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class GetRecordForm extends LightningElement {

    @api recordId;

    @wire(getRecord, { recordId: '$recordId', 
                       fields: [NAME_FIELD, 
                                TITLE_FIELD, 
                                PHONE_FIELD, 
                                EMAIL_FIELD]})
        contact;

    get title() {
        let titleVar = this.contact.data.fields.Title.value;
        return titleVar.toUpperCase();
    }

    get phone() {
        return this.contact.data.fields.Phone.value;
    }

    get email() {
        return this.contact.data.fields.Email.value;
    }
}