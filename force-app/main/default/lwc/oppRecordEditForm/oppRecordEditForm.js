import { LightningElement, api } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import ACCOUNT_FIELD from '@salesforce/schema/Opportunity.AccountId';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import CLOSE_DATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';


export default class OppRecordEditForm extends LightningElement {

    @api recordId;
    @api objectApiName = 'Opportunity';

    editMode = false;

    //create properties to hold schema info
    nameField = NAME_FIELD;
    amountField = AMOUNT_FIELD;
    accountField = ACCOUNT_FIELD;
    stageField = STAGE_FIELD;
    closeDateField = CLOSE_DATE_FIELD;

    toggleMode(){
        this.editMode = !this.editMode;
    }
}