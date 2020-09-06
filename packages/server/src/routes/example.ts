import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";
import {DB} from '../controller/db'
import {IBusTime} from '../models/bus-time';

const fs = require('fs');

interface BusTimeSource {
	stop_id: number,
	route_id: string;
    trip_id: string;
    departure_time: string;
    trip_headsign: string;
}


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
router.post('/test',async (req:Request,res:Response) => {	
	// Echo back the response body.
	let rawData = fs.readFileSync('E:\\translink.json');
	let translinkData = JSON.parse(rawData);
	console.log(translinkData.data.length);
	
	// for(var i=0; i < translinkData.data.length; i++)
	// {
	// 	let src = translinkData.data[i];		
	// 	let busTime = new DB.Models.BusTime();
	// 	busTime.stop_id = Number(src.stop_id);
	// 	busTime.route_id = src.route_id;
	// 	busTime.trip_id = src.trip_id;
	// 	busTime.departure_time = src.departure_time;
	// 	busTime.trip_headsign = src.trip_headsign;

	// 	await busTime.save((error:any,object:IBusTime) => {		
	// 		if(error){
	// 			console.log(error)
	// 			res.status(500).send({success:false,'msg':'Error creating poll.'})
	// 			return;
	// 		}			
	// 	});
	//}
	

	res.send({success:true,data:'done'})
});

// router.post('/mongo/example',async(req:Request,res:Response) => {	
// 	Echo back the response body.
// 	let contact = new DB.Models.Example(
// 		{
// 			name:"jack",
// 			email:"jack@work.com",
// 			phone:"1234567",
// 			message:"Testing mongoose example."
// 		}
// 	);
	
// 	try {
// 		await contact.save((err:any) => {
// 			if (err) throw err;
// 			res.send({sucess:true,message:"Saved example to mongodb."})
// 		})	
// 	} catch (error) {
// 		console.log(error);
// 		express.response.sendStatus(500)
// 	}
// });

router.get('/foo',async(req:Request,res:Response) => {
	const FILTER = {
		"trip_id" : /.*Weekday./,
		"stop_id":{$in:[1853,1797]}
	}
	
	try {
		await DB.Models.BusTime.find(FILTER, (err, results) => {
			if (err) throw err;
			res.send({results})
		})	
	} catch (error) {
		console.log(error);
		express.response.sendStatus(500)
	}
});

// router.get('/mongo/example/:id',async(req:Request,res:Response) => {
// 	const {id} = req.params;
// 	try {
// 		await DB.Models.Example.findById(id,(err, results) => {
// 			if (err) throw err;
// 			res.send({results})
// 		})	
// 	} catch (error) {
// 		console.log(error);
// 		express.response.sendStatus(500)
// 	}
// });

export = router;