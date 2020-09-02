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

interface PollViewProp {}
interface PollViewState {
	voted:boolean,
	poll:IPoll
}


/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class PollView extends React.Component<PollViewProp, PollViewState> {    
	constructor(props: PollViewProp) {
        super(props)

        this.state = {
			voted:false,
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
        this.callAPI('fetchActivePoll','GET','/poll/active');
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
			case 'vote':				
			this.setState({voted:true})
				break;				
		}				
	}
	
	private handleClick = (e:React.MouseEvent<HTMLButtonElement>) =>
	{
		let key = e.currentTarget.getAttribute('data-key');		
		this.callAPI('vote','POST',`/poll/${this.state.poll._id}/vote`,{key:key})		
	}
	/* ########################################################*/
	

	

	/* ########################################################*/
    /* UI Rendering*/
	private renderAnswers = () =>
	{
		return (
			<>
			{
				this.state.poll.answer.map((answer:IPollOption) => (
					<button key={answer.key} data-key={answer.key} onClick={this.handleClick}>{answer.response}</button>
				))
			}
			</>
		)
	}
	
	public render() {		
		if(this.state.voted)
		{
			return(<>
			<h2>Thanks for Voting.</h2>
			</>)
		}

		return (
		<section>
        	{this.renderAnswers()}			
        </section>
        )
    }
}

export default PollView