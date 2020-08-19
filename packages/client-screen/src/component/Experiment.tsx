import React from "react"

import {API} from "@7up/common-utils"
import {AxiosResponse } from 'axios';
interface ExperimentProp {
  name: string
}

interface ExperimentState {
  status: "" | "error" | "success"
}

class Experiment extends React.Component<ExperimentProp, ExperimentState> {  
    constructor(props: any) {
        super(props)

        this.state = {
            status: ""        
        }
    }

    /* ########################################################*/
    /* React lif cycle event.*/
    public componentDidMount(): void {
        console.log('Component Did Mount')
        let data = {foo:'this is something'}
        this.callAPI('','POST','/screen/test',data);
    }
    /* ########################################################*/

    
    /* ########################################################*/
    /* Framework methods. */
    private callAPI = (name:string,method:'GET'|'POST'|'PUT'|'DELETE',endpoint:string,data?:any,hideBusy?:boolean) => {                      
        new API().call(method,endpoint,(response:AxiosResponse<any>) => 
        {
            if(response.status === 200)
            {
                if(this.handleApiCallSuccess)
                {
                    this.handleApiCallSuccess(name,method,endpoint,response);
                }
            } else if(response.status === 500)
            {
                alert("Server Error: 500");
            }else{
                alert(response.data.msg.displayTxt)                
            }
        },data);
    }
    
    private handleApiCallSuccess = (name:string,method:string,endpoint:string,response:any) =>
    {
        console.log(name,method,endpoint,response);
    }
    /* ########################################################*/
  
  
    /* ########################################################*/
    /* Event Handlers. */
    private handleApiSuccess = (name: string, method: string, endpoint: string, response: any) => {
        
    }
    /* ########################################################*/

  
  
    /* ########################################################*/
    /* UI Rendering*/
    private renderSubComponentFoo() {
        if (this.state.status === 'error') return <div>Something Something Something</div>

        return (
        <div>
            This is some sub-component.
        </div>
        )
    }

    public render() {
        return (
        <div>
            <h2>Hello World</h2>
            {this.renderSubComponentFoo()}
        </div>               
        )
    }
}

export default Experiment
