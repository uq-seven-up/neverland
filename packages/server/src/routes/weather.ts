import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";
import {DB} from '../controller/db'
import { IWeather } from '../models/weather';
import fetch from "node-fetch";
//const fetch = require('node-fetch');


/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();

const API_KEY = (process.env.OPEN_WEATHER_MAP_API_KEY as any) as string;
const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=Brisbane&units=metric&APPID=${API_KEY}`
/**
 * Proof of concept for grabbing a parameter from the URL and assigning 
 * it to a variable.
 */
router.get('/weather', async (req: Request, res: Response) => {
	const WEATHER_ID = "UQ_WEATHER_CACHE"; /* PK for the UQ RSS feed. */
	const CACHE_FOR = 60;/* cache the RSS feed this number of minutes. */
	let weatherData: IWeather | null;
	try{
		weatherData =  await DB.Models.Weather.findById(WEATHER_ID);
		if(weatherData)
		{
			
			let cacheTime = new Date().getTime() - weatherData.fetch_date.getTime();
			let cacheMinutes = cacheTime === 0 ? 0 : Math.trunc(cacheTime / 60000); /* 1000ms * 60 = minutes */
			if(cacheMinutes <= CACHE_FOR)
			{
				res.send({success:true,data:weatherData,cached:true})
				return;
			}
		}else
		{
			weatherData = await new DB.Models.Weather({_id:WEATHER_ID});
		}						
	} catch(error)
	{
		console.log('Error fetching WEATHER cache.');
		res.status(500).send({success:false,'msg':'Error fetching WEATHER cache.'})
	}


	try {
		await fetch(API_URL)
			.then((res:any) => res.json())
			.then((result:any) => {				
				weatherData!.temp = result.main.temp as number;
				weatherData!.status = result.weather[0].main as string;
			});
	} catch (error) {
		console.log('Some error occured fetching data from the Weather API.');
		res.status(500).send({ success: false, 'msg': 'Error fetching Weather data.'})
		
	}

	await weatherData!.save((err: any, object: IWeather) => {
		if (err){
			res.status(500).send({success:false,'msg':'Mongoose save error.',error:err})
			return;
		}
		res.send({success:true,data:object,cached:false})
	});
});


export = router;