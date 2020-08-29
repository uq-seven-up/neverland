import * as express from 'express';
import { Request, Response } from "express";
import RSSParser = require('rss-parser');
import dotenv from "dotenv";
import {DB} from '../controller/db'
import { IRssFeed} from '../models/rss';
/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();

/**
 * Proof of concept for grabbing a parameter from the URL and assigning 
 * it to a variable.
 */
router.get('/test/:id',(req:Request,res:Response):void => {
	const {id} = req.params;
	res.send({id})
});


/**
 * Proof of concept for receiveing an JSON object in the request body and 
 * echoing the JSON back in the response.
 */
router.post('/test',(req:Request,res:Response):void => {	
	// Echo back the response body.
	res.send(req.body)
});

router.post('/mongo/example',async(req:Request,res:Response) => {	
	// Echo back the response body.
	let contact = new DB.Models.Example(
		{
			name:"jack",
			email:"jack@work.com",
			phone:"1234567",
			message:"Testing mongoose example."
		}
	);
	
	try {
		await contact.save((err:any) => {
			if (err) throw err;
			res.send({sucess:true,message:"Saved example to mongodb."})
		})	
	} catch (error) {
		console.log(error);
		express.response.sendStatus(500)
	}
});

router.get('/mongo/example',async(req:Request,res:Response) => {
	try {
		await DB.Models.Example.find({}, (err, results) => {
			if (err) throw err;
			res.send({results})
		})	
	} catch (error) {
		console.log(error);
		express.response.sendStatus(500)
	}
});

router.get('/mongo/example/:id',async(req:Request,res:Response) => {
	const {id} = req.params;
	try {
		await DB.Models.Example.findById(id,(err, results) => {
			if (err) throw err;
			res.send({results})
		})	
	} catch (error) {
		console.log(error);
		express.response.sendStatus(500)
	}
});

/**
 * Fetch and parse the RSS news feed published by UQ.
 * 
 * Respond with the RSS feed converted into JSON format.
 */
router.get('/uqnews',async(req:Request,res:Response) => {
	const FEED_ID = "UQ_NEWS_CACHE"; /* PK for the UQ RSS feed. */
	const CACHE_FOR = 5;/* cache the RSS feed this number of minutes. */
	let rssParser = new RSSParser();
	let feed:any;
	let rssFeed:IRssFeed|null;

	try{
		rssFeed =  await DB.Models.RssFeed.findById(FEED_ID);
		if(rssFeed)
		{
			let cacheTime = new Date().getTime() - rssFeed.fetch_date.getTime();
			let cacheMinutes = cacheTime === 0 ? 0 : Math.trunc(cacheTime / 60000); /* 1000ms * 60 = minutes */
			if(cacheMinutes <= CACHE_FOR)
			{
				res.send({success:true,data:rssFeed?.items,cached:true})
				return;
			}
		}else
		{
			rssFeed = new DB.Models.RssFeed({_id:FEED_ID});
		}						
	} catch(error)
	{
		console.log('Error fetching RSS cache.');
		res.status(500).send({success:false,'msg':'Error fetching RSS cache.',error:error})
	}

	try{
		feed = await rssParser.parseURL('https://www.uq.edu.au/news/rss/news_feed.xml');
		rssFeed!.items = feed.items;
		rssFeed!.fetch_date = new Date();
	} catch(error)
	{
		res.status(500).send({success:false,'msg':'Error fetching UQ news feed.'})
		return
	}
	
	await rssFeed!.save((err:any,object:IRssFeed) => {
		if (err){
			res.status(500).send({success:false,'msg':'Mongoose save error.',error:err})
			return;
		}
		res.send({success:true,data:object.items,cached:false})
	});
});

router.get('/weather', async(req: Request, res: Response) => {
	const api = {
		key: "449c1afcdfb1e4a46195ffa200b56b4e",
		base: "https://api.openweathermap.org/data/2.5/"
	}
	try {
		await fetch(`${api.base}weather?q=Brisbane&units=metric&APPID=${api.key}`)
			.then(res => res.json())
			.then(result => {
				res.send(result);
			
			});
	} catch (error) {
		console.log('Some error occured fetching data from the news feed.')
		express.response.sendStatus(500)
	}
});

export = router;