import * as express from 'express';
import { Request, Response } from "express";
import RSSParser = require('rss-parser');
import dotenv from "dotenv";
import QRCode  from "qrcode"
import {DB} from '../controller/db'
import { IRssFeed} from '../models/rss';
import { queryByPlaceholderText } from '@testing-library/dom';
/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();


/**
 * Create a qrcode for the passed in URL.
 * 
 * Expects a JSON string in the format: {"url":"url to encode"}
 */
router.post('/qrcode',async(req:Request,res:Response) => {
	const {url} = req.body;
	try{
		let qrData =  await QRCode.toDataURL(url);
		if(qrData)
		{			
			res.send({success:true,data:qrData})
			return;			
		}else{
			res.send({success:false,data:qrData})
		}						
	} catch(error)
	{
		console.log('Error creating QR Code.');
		res.status(500).send({success:false,'msg':'Error creating the QR code.',error:error})
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


export = router;