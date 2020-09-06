import React from "react"

import {API} from "@7up/common-utils"
import {AxiosResponse } from 'axios';

interface BusTime{
    route_id: string;
    trip_id: string;
    departure_date: string;
    trip_headsign: string;
}

interface BusWidgetProp {
  name: string
}

interface BusWidgetState {
  status: "on" | "off",
  busTimes: BusTime[]
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class BusWidget extends React.Component<BusWidgetProp, BusWidgetState> {  
    constructor(props: any) {
        super(props)

        this.state = {
            status: "off",
            busTimes: []
        }       
    }

    /* ########################################################*/
    /* React life-cycle event.*/
    public componentDidMount(): void {
        console.log('Component Did Mount')
        var stop_value = this.props.name === "UQ Lakes"? "uqlakes": "chancellor";
        this.callAPI('', 'GET', '/bus/get-bus-times?stop=' + stop_value);
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
        this.setState({status: 'on', busTimes:result.data});
    }
    /* ########################################################*/


    /* ########################################################*/
    /* UI Rendering*/
    /**
     * Render a sub-component based on some business logic. Just another proof
     * of concept to see how the main render method can use helper methods for 
     * modularising rendering the component HTML.
     * 
     * @returns JSX element
     */
    private renderBusTimes() {
        if (this.state.status === 'off') return <div></div>

        return (
            <ul>
                {this.state.busTimes.map((item: BusTime) => (
                    <li>
                        <div>
                            {item.route_id}
                        </div>
                        <div>
                            {item.trip_headsign}
                        </div>
                        <div>
                            {item.departure_date}
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    public render() {
        return (
		<section className="widget transit">
        	<div className="heading">
				<h2>{this.props.name}</h2>
				<figure></figure>
			</div>
			<div className="content">
            	{this.renderBusTimes()}
			</div>
        </section>
        )
    }
}

export default BusWidget