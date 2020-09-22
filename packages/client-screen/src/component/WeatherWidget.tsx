import React from "react"


interface WeatherWidgetProp {
  name: string,
  id?:string
}

interface WeatherWidgetState {
  weather: WeatherData
}

interface WeatherData {
  name: string
  main: { temp: number, feels_like:number}
  weather: [{ main: string, description: string }]
  sys: { country: string }
}
/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class WeatherWidget extends React.Component<WeatherWidgetProp, WeatherWidgetState> {
  
  private api = {
    key: "876d2f560d0fdf408518c005b833fad6",
    base: "https://api.openweathermap.org/data/2.5/"
  }
  
  constructor(props: any) {
    super(props)

    this.state = {
      weather: {
        name: "Brisbane",
        main: { temp: 25, feels_like: 25} ,
        weather: [{main: "cloud", description: "cloudy"}],
        sys: {country: "AU"}}
    }
  }

    
  /* ########################################################*/
  /* React life-cycle event.*/
  public componentDidMount(): void {
    this.fetchWeather();
  }
  /* ########################################################*/
  private dateBuilder = (d: Date) => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day}, ${date} ${month} ${year}`
  }
    
  private fetchWeather() {
  
    fetch(`${this.api.base}weather?q=Brisbane&units=metric&APPID=${this.api.key}`)
      .then(res => res.json())
      .then(result => {
        this.setState({ weather: result });
      });

  }
  
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
