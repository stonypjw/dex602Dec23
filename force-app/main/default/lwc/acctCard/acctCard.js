import { LightningElement, api } from 'lwc';

export default class AcctCard extends LightningElement {

    @api accountId;
    @api name;
    @api accnum;
    @api revenue;
    @api phone;
    @api website;
    
    handleSelect() {
        const selectEvent = new CustomEvent('selected', { detail: { 'prop1': this.accountId, 'prop2': this.name}});
        this.dispatchEvent(selectEvent);
    }

}