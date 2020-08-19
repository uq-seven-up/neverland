import React from "react"

import {API} from "@7up/common-utils"
import {AxiosResponse } from 'axios';
interface ExperimentProp {
  name: string
}

interface RssArticle {
    author: string
    content: string
    creator: string
    guid: string
    isoDate: Date
    link: string
    pubDate: Date
    title: string
}

interface ExperimentState {
  status: "" | "error" | "success"
  feed:RssArticle[]
}


class Experiment extends React.Component<ExperimentProp, ExperimentState> {  
    constructor(props: any) {
        super(props)

        this.state = {
            status: "",
            feed:[]        
        }       
    }

    /* ########################################################*/
    /* React lif cycle event.*/
    public componentDidMount(): void {
        console.log('Component Did Mount')
        //let data = {foo:'this is something'}
        //this.callAPI('','POST','/screen/test',data);
        this.callAPI('','GET','/screen/uqnews');
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
                    this.handleApiCallSuccess(name,method,endpoint,response.data);
                }
            } else if(response.status === 500)
            {
                alert("Server Error: 500");
            }else{
                alert(response.data.msg.displayTxt)                
            }
        },data);
    }
    /* ########################################################*/
  
  
    /* ########################################################*/
    /* Event Handlers. */
    private handleApiCallSuccess = (name:string,method:string,endpoint:string,result:any) =>
    {        
        this.setState({feed:result.data.items})                
    }
    /* ########################################################*/

  
  
    /* ########################################################*/
    /* UI Rendering*/
    private renderSubComponentFoo() {
        if (this.state.status === 'error') return <div>Something Something Something</div>

        return (
        <div>
            <h3>UQ News Headlines</h3>
            <ul>
                {this.state.feed.map((item:RssArticle) => (
                    <li key={item.guid}>{item.title}</li>
                ))}
            </ul>
        </div>
        )
    }

    public render() {
        return (
        <div>
            <h2>News Feed Component</h2>
            {this.renderSubComponentFoo()}
        </div>               
        )
    }
}

export default Experiment
