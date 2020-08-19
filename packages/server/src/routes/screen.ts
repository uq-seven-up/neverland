import * as express from 'express';
import { Request, Response } from "express";
import RSSParser = require('rss-parser');

const router = express.Router();

router.get('/test:id',(req:Request,res:Response) => {
	const {id} = req.params;
	res.send({id})
});

router.get('/test',(req:Request,res:Response) => {
	res.send('{message:"Hello World"}')
});

router.post('/test',(req:Request,res:Response) => {	
	// Echo back the response body.
	res.send(req.body)
});

router.get('/uqnews',async(req:Request,res:Response) => {
	let rssParser = new RSSParser();
	try{		
		await rssParser.parseURL('https://www.uq.edu.au/news/rss/news_feed.xml',(err,feed) => {
		if (err) throw err;
		res.send(feed)
	});
	} catch(error)
	{
		console.log('Some error occured fetching data from the news feed.')
		express.response.sendStatus(500)
	}
});

export = router;