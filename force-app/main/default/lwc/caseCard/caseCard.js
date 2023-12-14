import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseCard extends NavigationMixin(LightningElement) {

    // public properties to hold the Case record field values
    @api caseNumber;
    @api subject;
    @api status;
    @api priority;
    @api caseId;

    // create a method to navigate to the full case record
    viewRecord() {
        // call the Navigate method from NavigationMixin and pass in some parameters
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.caseId,
                actionName: 'view'
            }
        });
    }

    // create a method to open the recordModal component window
    editCase() {
        // open the modal window
        RecordModal.open({
            size: 'small',
            recordId: this.caseId,
            objectApiName: 'Case',
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Case'
        })
        .then((result) => {
            console.log(result);

            // check to see if the result is modsuccess, and if so, dispatch a toast event
            if (result === 'modsuccess') {
                // create a toast message
                const myToast = new ShowToastEvent({
                    title: 'Case Saved Successfully',
                    message: 'The case record was updated successfully!',
                    variant: 'success',
                    mode: 'dissmissible'
                });

                // dispatch toast message event
                this.dispatchEvent(myToast);
            }
        });
    }
}