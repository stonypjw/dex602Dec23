import { LightningElement, api } from 'lwc';

export default class OpportunityRecordForm 
                           extends LightningElement {
    
    @api recordId; //Will be populated from page
    @api objectApiName = 'Opportunity';
    @api layoutType = 'Compact';
    @api formMode = 'readonly';

    handleCancel() {
        const cancelEvent = new CustomEvent('cancel');
        this.dispatchEvent(cancelEvent);
    }

    handleSuccess() {
        const successEvent = new CustomEvent('success');
        this.dispatchEvent(successEvent);
    }

                           }