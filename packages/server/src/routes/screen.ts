import * as express from 'express';
import { Request, Response } from "express";
import RSSParser = require('rss-parser');

const router = express.Router();

router.get('/test:id',(req:Request,res:Response) => {
	const {id} = req.params;
	res.send({id})
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