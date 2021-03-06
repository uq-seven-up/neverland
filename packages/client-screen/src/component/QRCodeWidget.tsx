import React from "react"

import {API} from "@7up/common-utils"
import {AxiosResponse } from 'axios';

interface QRCodeWidgetProp {
	qrCodeUrl:string,
	id?:string
}

interface QRCodeWidgetState {
	qrCodeData:string
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class QRCodeWidget extends React.Component<QRCodeWidgetProp, QRCodeWidgetState> {    
	constructor(props: QRCodeWidgetState) {
        super(props as any)
		
        this.state = {
            qrCodeData:'/client-screen/gfx/production-mobile-qr.png'/* This is a place holder QR code which is used until the real on is retrieved from the API. (This is also the production QR code.) */
        }
	}

    public componentDidMount(): void {		
		this.callAPI('','POST','/screen/qrcode',{url:this.props.qrCodeUrl});
	}

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
		this.setState({qrCodeData:result.data})				
	}	
	

    public render() {				
		return (
		<section id={this.props.id} className="widget qrcode">        				
            <img src={this.state.qrCodeData} alt=""/>			
        </section>
        )
    }
}

export default QRCodeWidget