import React from "react"
import { API } from '@7up/common-utils';
import { AxiosResponse } from 'axios';

interface WeatherInfo {
	temp: number;
	status: string;
}


interface WeatherWidgetProp {
  name: string,
  id?:string
}

interface WeatherWidgetState {
	weather: WeatherInfo;
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class WeatherWidget extends React.Component<WeatherWidgetProp, WeatherWidgetState> {
    
  constructor(props: WeatherWidgetProp) {
    super(props)

    this.state = {
			weather: {
				temp: 0,
				status: " "
		 },
    }
  }
  private dateBuilder = (d: Date) => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day}, ${date} ${month} ${year}`
  }
	

	/*Setting the icon name depending on the state of weather setting on Clouds by defaulty*/
	private iconName = () => {
		let iconName = 'Clouds'				
		if (this.state.weather.status === "Clouds") {
			iconName = 'cloudy-icon';	
    } else if (this.state.weather.status === 'Clear') {
			iconName = 'sunny-icon';
    } else if (this.state.weather.status === 'Thunderstorm') {
			iconName = 'thunder-icon';
		} else if (this.state.weather.status === 'Rain') {
			iconName = 'rainy-icon';
		}
		return iconName;
	}
    
  /* ########################################################*/
  /* React life-cycle event.*/
  public componentDidMount(): void {
		this.callAPI('', 'GET', '/weather/weather');
  }
  /* ########################################################*/
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
	private callAPI = (
		
		name: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		endpoint: string,
		data?: any,
		hideBusy?: boolean,
	): void => {
		let baseUrl = (process.env.REACT_APP_NEVERMIND_API_BASE as any) as string;
		new API(baseUrl).call(
			method,
			endpoint,
			(response: AxiosResponse<any>) => {
				if (response.status === 200) {
					if (this.handleApiCallSuccess) {
						this.handleApiCallSuccess(name, method, endpoint, response.data);
						
					}
				} else if (response.status === 500) {
					alert('Server Error: 500');
	
				} else {
					alert(response.data.msg.displayTxt);	
				}
			},
			data,
		);
  };
  
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
	private handleApiCallSuccess = (
		name: string,
		method: string,
		endpoint: string,
		result: any,
	): void => {
		this.setState({ weather: result.data });
	};
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

	
	 
   
	public render() {

		window.localStorage.setItem("temp", (this.state.weather.temp as any) as string);
		window.localStorage.setItem("status", (this.state.weather.status as any) as string);
    return (
      <section id={this.props.id} className="widget weather">						
		<div className="date">{this.dateBuilder(new Date())}</div>				
        <div className="weather-box">
    		<div className={this.iconName()}></div>  
            <div className="temp">        
              {Math.round(this.state.weather.temp)}°c 
            </div>
		</div>
	</section>
    )
  }
}

export default WeatherWidget
