import * as express from 'express';
import { Request, Response } from "express";
import RSSParser = require('rss-parser');
import dotenv from "dotenv";
import {DB} from '../controller/db'

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