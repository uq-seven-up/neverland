import * as express from 'express';
import { Request, Response } from "express";
import RSSParser = require('rss-parser');

/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();


/**
 * Proof of concept for grabbing a parameter from the URL and assigning 
 * it to a variable.
 */
router.get('/test:id',(req:Request,res:Response):void => {
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


/**
 * Fetch and parse the RSS news feed published by UQ.
 * 
 * Respond with the RSS feed converted into JSON format.
 */
router.get('/uqnews',async(req:Request,res:Response) => {
	let rssParser = new RSSParser();
	try{		
		await rssParser.parseURL('https://www.uq.edu.au/news/rss/news_feed.xml',(err,feed) => {
		if (err) throw err;
		let result = {success:true,data:feed}
		res.send(result)
	});
	} catch(error)
	{
		console.log('Some error occured fetching data from the news feed.')
		express.response.sendStatus(500)
	}
});

export = router;