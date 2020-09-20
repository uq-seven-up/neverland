import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";
import WebSocket from 'ws';
import {GameMap} from '@7up/common-types';

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
	let gameMap = new Map() as GameMap;
	gameMap.set('g_2_1',{id:'g_2_1',x:2,y:1,class:'tile_ship'});
	gameMap.set('g_2_2',{id:'g_2_2',x:2,y:2,class:'tile_ship'});
	
	/* Transform Map type (GameMap) to an object that can be serialized to JSON.*/
	let mapObject:any = {};  
	gameMap.forEach((value, key) => {  
		mapObject[key] = value  
	}); 

	let data = {
		gameMap:mapObject
	}
	
	req.app.locals.ws.clients.forEach(function each(client:any) {
		if (client.readyState === WebSocket.OPEN) {			
			client.send(JSON.stringify(data));
		}
	});
	
	res.send({results:'Completed Broadcast to connected clients.',data})
});

export = router;
