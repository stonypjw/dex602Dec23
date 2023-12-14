import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OppCard extends NavigationMixin(LightningElement) {

    @api name;
    @api stage;
    @api amount;
    @api closeDate;
    @api oppId;

    //event handler for onlick on Name
    viewRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view' 
            }
        });
    }

    //event handler to display modal box
    editOpp() {
        RecordModal.open({
            size: 'small',
            recordId: this.oppId,
            objectApiName: 'Opportunity',
            headerLabel: 'Edit Opportunity'
        })
        .then((result) => {
            console.log(result);

            if(result === 'modsuccess') {
                const successToast = new ShowToastEvent({
                    title: 'Opportunity Updated Successfully',
                    message: 'Your record has been updated',
                    variant: 'success',
                    mode: 'dissmissible'
                });

                this.dispatchEvent(successToast);

                //notify oppList that a refresh of data is needed
                const saveEvent = new CustomEvent('modsaved');
                this.dispatchEvent(saveEvent);
                
            }
        });
    }
}