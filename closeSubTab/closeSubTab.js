import { LightningElement, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_cmt/omniscriptBaseMixin';
import { NavigationMixin } from 'lightning/navigation';


const STATE_NAME = 'closeSubTab';


export default class CloseSubTab extends NavigationMixin(OmniscriptBaseMixin(LightningElement)) {

    @api contactid; //This Contact id is passed from omniscript


    connectedCallback() {
        
        console.log('contactid'+this.contactid);
        if (this.omniGetSaveState(STATE_NAME)?.state != null) {
            Object.assign(this, this.omniGetSaveState(STATE_NAME).state);
        }

    }

    navigateToContact() {
        this.invokeWorkspaceAPI('isConsoleNavigation').then(isConsole => {
            if(isConsole) {
                /* Calling WorkspaceAPI to get the tab Id and to close it */
                this.invokeWorkspaceAPI('getFocusedTabInfo').then(focusedTab => {
                    console.log(focusedTab.tabId);
                    this.invokeWorkspaceAPI('closeTab', {
                        tabId: focusedTab.tabId,
                    });
                });
            }
            else{
                /* calling Navigation action for page redirection in standard apps */
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',

                    attributes: {
                        recordId: this.contactid,
                        objectApiName: 'Contact',
                        actionName: 'view'
                    }
                });    
            }
        });
    
    }

     /* Dispatches event to close the current tab */
     invokeWorkspaceAPI(methodName, methodArgs) {
        return new Promise((resolve, reject) => {
            const closeCurrentTabEvent = new CustomEvent("internalapievent", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: {
                    category: "workspaceAPI",
                    methodName: methodName,
                    methodArgs: methodArgs,
                    callback: (err, response) => {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(response);
                        }
                    }
                }
            });

            this.dispatchEvent(closeCurrentTabEvent);
        });
    }
}