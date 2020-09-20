import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";
import WebSocket from 'ws';

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
 * Proof of concept for pushing a message to all connected web socket clients 
 * in response to a REST call.
 */
router.get('/broadcast',async(req:Request,res:Response) => {
	req.app.locals.ws.clients.forEach(function each(client:any) {
		if (client.readyState === WebSocket.OPEN) {
			let data = {
				message:"Hello from node express!"
			}
			
			client.send(JSON.stringify(data));
		}
	});
	
	res.send({results:'Completed Broadcast to connected clients.'})
});

export = router;