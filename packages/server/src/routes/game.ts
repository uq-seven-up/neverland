import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";

import {Game} from '../lib/Game';
import {GameMap,CompassHeading} from '@7up/common-types';


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
router.get('/move',(req:Request,res:Response):void => {
	console.log('move');
	let game = req.app.locals.game as Game;
	game.moveShip('123',CompassHeading.East,1);	
	
	let data = game.broadCastGameMap(req.app.locals.ws);

	res.send({results:'Moved Ship',data})
});


/**
 * Proof of concept for pushing a message to all connected web socket clients 
 * in response to a REST call.
 */
router.get('/broadcast',async(req:Request,res:Response) => {
	let game = req.app.locals.game as Game;
	let data = game.broadCastGameMap(req.app.locals.ws);
	
	res.send({results:'Completed Broadcast to connected clients.',data:data})
});

export = router;
