import React from "react"

import {API} from "@7up/common-utils"
import {AxiosResponse } from 'axios';

declare interface IPollOption{
    key: string
    response: string
    votes: number
}

declare interface IPoll{	
	_id:string,
	name: string
    published_date: Date
	question: string,
	answer: IPollOption[]
    creation_date: Date
}

interface PollWidgetProp {}
interface PollWidgetState {
  poll:IPoll
}

/**
 * This widget displays news articles retrieved by the REST Server from the UQ RSS news feed.
 */
class PollWidget extends React.Component<PollWidgetProp, PollWidgetState> {  
	private ws:any;
	private interval:any;
	
	constructor(props: PollWidgetState) {
        super(props)
		/* 
		NOTE: REACT call a constructor twice in strict mode. Which is why the websocket code is not here.
		https://github.com/facebook/react/issues/12856#issuecomment-613145789
		*/		
        this.state = {
            poll:{
				_id:'',
				name:'',
				published_date:new Date(),
				question:'',
				answer:[],
				creation_date:new Date()
			}        
        }       
    }

    /* ########################################################*/
    /* React life-cycle methods.*/
    public componentDidMount(): void {
		this.ws = new WebSocket(process.env.REACT_APP_SOCKET_SERVER as string + '?uuid=POLL_WIDGET');
		this.ws.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('Poll connected to socket server.')
		}

		this.ws.onmessage = (evt:any) => {
			// listen to data sent from the websocket server
			const data = JSON.parse(evt.data)
			if(data.poll)
			{
				this.callAPI('fetchActivePoll','GET','/poll/active');
			}
		}

		this.callAPI('fetchActivePoll','GET','/poll/active');
	}
	
	public componentWillUnmount(): void {
        this.ws.terminate();
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
		switch(name){
			case 'fetchActivePoll':				
				this.setState({poll:result.data.poll})
				break;			
		}				
	}
    /* ########################################################*/

    
    /* ########################################################*/
    /* UI Rendering*/    
    /**
     * Render the list of articles received from the RSS feed retrieved by the REST Server.
     * 
     * @returns JSX element
     */
    private renderPoll():JSX.Element {        
        return (
			<table>					
				<tbody>
                {this.state.poll.answer.map((answer:IPollOption) => (
                    <tr key={answer.key}>
						<td>{answer.response}</td>
						 <td><span>{answer.votes}</span></td>
					</tr>
                ))}
				</tbody>
            </table>
        )
    }

    public render() {
        return (
        <section className="widget poll">
            <div className="heading">
				<h2>UQ Poll</h2>
				<figure></figure>
			</div>
			<div className="content">
				<h2>{this.state.poll.question}</h2>				
				{this.renderPoll()}
			</div>
        </section>
        )
    }
    /* ########################################################*/
}

export default PollWidget
