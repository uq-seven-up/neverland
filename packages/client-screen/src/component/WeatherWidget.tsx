import React from "react"
import { API } from '@7up/common-utils';
import { AxiosResponse } from 'axios';

interface WeatherWidgetProp {
  name: string,
  id?:string
}

interface WeatherWidgetState {
  weather: WeatherData
}

interface WeatherData {
  main: { temp: number,}
  weather: [{ main: string}]
}
/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class WeatherWidget extends React.Component<WeatherWidgetProp, WeatherWidgetState> {
    
  constructor(props: any) {
    super(props)

    this.state = {
      weather: {
     
        main: { temp: 25} ,
        weather: [{ main: "cloud"}],
      }
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
    
    
  /* ########################################################*/
  /* React life-cycle event.*/
  public componentDidMount(): void {
    console.log('Component Did Mount');
    // var stop_value = this.props.name === 'UQ Lakes' ? 'uqlakes' : 'chancellor';
    this.callAPI('', 'GET', '/weather/weather-data');
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
    let iconName = ''
    if (this.state.weather.weather[0].main === 'Clouds') {
      iconName = 'cloudy-icon'
    } else if (this.state.weather.weather[0].main === 'Clear') {
      iconName = 'sunny-icon'
    } else {
      iconName = 'rainy-icon'
    }
    
    return (
      <section id={this.props.id} className="widget weather">
		<div className="content">
		
			<div>
				<div className="location-box">
					<div className="date">{this.dateBuilder(new Date())}</div>
				</div>
          <div className="weather-box">
            <div className={iconName}></div>  
            <div className="temp">
            
              {Math.round(this.state.weather.main.temp)}°c 
            </div>				

				</div>
			</div>
		 
		</div>
	</section>
    )
  }
}

export default WeatherWidget
