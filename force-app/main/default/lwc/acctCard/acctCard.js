import { LightningElement, api } from 'lwc';

export default class AcctCard extends LightningElement {

    @api accountId;
    @api name;
    @api accnum;
    @api revenue;
    @api phone;
    @api website;
    
}