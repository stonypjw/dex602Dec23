import { LightningElement, api } from 'lwc';

export default class ChildComponent extends LightningElement {

        //define two public properties
        @api childName;
        @api age;

        //private property - only for use within the component
        childSpeak;

        //event handler for onchange event
        respondToParent(event) {
            //create a custom event to pass data to parent
            this.childSpeak = event.detail.value;
            const myEvent = 
                 new CustomEvent('speak', { detail: this.childSpeak });
            this.dispatchEvent(myEvent);
        }

        // constructor lifecycle method
        constructor() {
            super();
            console.log('Child Component:  Constructor fired...');
        }
    
        // connected and disconnected callback lifecycle methods
        connectedCallback() {
            console.log('Child Component:  connectedCallback fired...');
        }
    
        disconnectedCallback() {
            console.log('Child Component:  disconnectedCallback fired...');
        }
    
        // rendered callback lifecycle method
        renderedCallback() {
            console.log('Child Component:  renderedCallback fired...');
        }
}