import React from "react"

import {API} from "@7up/common-utils"
import {AxiosResponse } from 'axios';

interface RssWidgetProp {}

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

interface RssWidgetState {
  feed:RssArticle[]
}


class RssWidget extends React.Component<RssWidgetProp, RssWidgetState> {  
    constructor(props: RssWidgetProp) {
        super(props)

        this.state = {
            feed:[]        
        }       
    }

    /* ########################################################*/
    /* React lif cycle event.*/
    public componentDidMount(): void {
        this.callAPI('','GET','/screen/uqnews');
    }
    /* ########################################################*/

    
    /* ########################################################*/
    /* Framework methods. */
    private callAPI = (name:string,method:'GET'|'POST'|'PUT'|'DELETE',endpoint:string,data?:any,hideBusy?:boolean) => {                      
        let baseUrl = process.env.REACT_APP_NEVERMIND_API_BASE as any as string; 
        console.log('slute',process.env,baseUrl);
        new API(baseUrl).call(method,endpoint,(response:AxiosResponse<any>) => 
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
    private renderArticles() {        
        return (
            <ul>
                {this.state.feed.map((item:RssArticle) => (
                    <li key={item.guid}>{item.title}</li>
                ))}
            </ul>        
        )
    }

    public render() {
        return (
        <div className="widget">
            <h2>UQ News</h2>
            {this.renderArticles()}
        </div>               
        )
    }
}

export default RssWidget
