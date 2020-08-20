import React from "react"

import {API} from "@7up/common-utils"
import {AxiosResponse } from 'axios';

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

interface RssWidgetProp {}

interface RssWidgetState {
  feed:RssArticle[]
}

/**
 * This widget displays news articles retrieved by the REST Server from the UQ RSS news feed.
 */
class RssWidget extends React.Component<RssWidgetProp, RssWidgetState> {  
    constructor(props: RssWidgetProp) {
        super(props)

        this.state = {
            feed:[]        
        }       
    }

    /* ########################################################*/
    /* React life-cycle methods.*/
    public componentDidMount(): void {
        this.callAPI('','GET','/screen/uqnews');
    }
    /* ########################################################*/

    
    /* ########################################################*/
    /* Working methods. */        
    /**
     * Make an API call to the neverland REST server.
     * 
     * @param name - An arbitrary identifier for this request, this value is passed through to the provide callback.
     * @param method - The HTTP method that will be used for the request.
     * @param endpoint - The API endpoint (route) which is called on the REST Server.
     * @param data - Optional: A simple object which is passed to the REST API inside of the request body.
     * @param hideBusy - Optional: not implemented yet. (suppresses the loading spinner) 
     * @returns void
     */
    private callAPI = (name:string,method:'GET'|'POST'|'PUT'|'DELETE',endpoint:string,data?:any,hideBusy?:boolean):void => {                      
        let baseUrl = process.env.REACT_APP_NEVERMIND_API_BASE as any as string; 
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
    /**
     * This method is called by callAPI() afer a successfull response has been received from the REST Server.
     * 
     * @param name - The name that was passed in to the callAPI method when this request was initiated.
     * @param method - The HTTP method that was passed in to the callAPI method when this request was initiated.
     * @param endpoint - The API endpoint (route) that was passed in to the callAPI method when this request was initiated.
     * @param result - The data received from the REST APIs response body.
     * @returns void
     */
    private handleApiCallSuccess = (name:string,method:string,endpoint:string,result:any):void =>
    {        
        this.setState({feed:result.data.items})                
    }
    /* ########################################################*/

    
    /* ########################################################*/
    /* UI Rendering*/    
    /**
     * Render the list of articles received from the RSS feed retrieved by the REST Server.
     * 
     * @returns JSX element
     */
    private renderArticles():JSX.Element {        
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
    /* ########################################################*/
}

export default RssWidget
