import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";

interface WeatherData {
	main: { temp: number,}
  weather: [{ main: string}]
}

/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();
const API_KEY = process.env.KEY as string;
const API_URL = `"https://api.openweathermap.org/data/2.5/weather?q=Brisbane&units=metric&APPID="${API_KEY}`
/**
 * Proof of concept for grabbing a parameter from the URL and assigning 
 * it to a variable.
 */
router.get('/weather-data', async(req: Request, res: Response) => {
	let Weather: WeatherData = {
		main: { temp: 25,},
  	weather: [{ main: "clouds"}]
	}
	try {
		await fetch(API_URL)
			.then(res => res.json())
			.then(result => {
				Weather = result 
				res.send({ success: true, data: Weather});
			
			});
	} catch (error) {
		console.log('Some error occured fetching data from the Weather API.')
		express.response.sendStatus(500)
	}
});


export = router;