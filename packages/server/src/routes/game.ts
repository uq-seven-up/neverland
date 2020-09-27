import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";

import {SocketUtil} from '../lib/SocketUtil';

/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();

/**
 * Proof of concept for pushing a message to all connected web socket clients 
 * in response to a REST call.
 */
router.get('/broadcast',async(req:Request,res:Response) => {
	let socketUtil = req.app.locals.socketUtil as SocketUtil;
	socketUtil.broadCast(req.app.locals.ws,'hello world');
	res.send({results:'Completed Broadcast to connected clients.'})
});

export = router;
