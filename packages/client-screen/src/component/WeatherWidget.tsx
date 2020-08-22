import React from "react"

interface WeatherWidgetProp {
  name: string
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
    key: "449c1afcdfb1e4a46195ffa200b56b4e",
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
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
  
    return `${day} ${date} ${month} ${year}`
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
    return (
      <div className="widget weather">
        <div className={(this.state.weather.main.temp > 17) ? 'app warm' : 'app'}>
          <div>
            <div className="location-box">
              <div className="location">{this.state.weather.name}, {this.state.weather.sys.country}</div>
              <div className="date">{this.dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                {Math.round(this.state.weather.main.temp)}°c <br></br>
                feels like: {Math.round(this.state.weather.main.feels_like)}°c
              </div>
              
              <div className="weather_status">{this.state.weather.weather[0].main}, {this.state.weather.weather[0].description} </div>
              
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WeatherWidget



