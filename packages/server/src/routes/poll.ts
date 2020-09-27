import * as express from 'express';
import { Request, Response } from "express";
import WebSocket from 'ws';
import dotenv from "dotenv";
import {DB} from '../controller/db'
import {IPoll, IPollOption} from '../models/poll';
import {SocketUtil} from '../lib/SocketUtil';
import {CFKitUtil} from '@7up/common-utils'

/**
 * Defines the REST API that is used to manage user polls.
 */
const router = express.Router();
dotenv.config();

/**
 * Create a new poll.
 */
router.post('/create',async(req:Request,res:Response) => {	
	let poll = new DB.Models.Poll();
	poll._id = CFKitUtil.createGUID();
	poll.name = 'TechPoll-1'
	poll.published_date = new Date();
	poll.question = "Your strongest tech prediction.";
	poll.creation_date = new Date();
	poll.answer.push({key:'a',response:'Chrome needs 128GB RAM to run.',votes:0})
	poll.answer.push({key:'b',response:'Human on Mars',votes:0})
	poll.answer.push({key:'c',response:'More than two people use Safari',votes:0})
	poll.answer.push({key:'d',response:'Flying Cars',votes:0})

	await poll.save((error:any,object:IPoll) => {		
		if(error){
			console.log(error)
			res.status(500).send({success:false,'msg':'Error creating poll.'})
			return;
		}

		res.send({success:true,data:{poll:poll}})
	});
});


/**
 * Retrieve the currently active poll.
 */
router.get('/active',async(req:Request,res:Response) => {	
	const pollid = 'd7abfc00-cff1-4c08-9282-2d50dad17d31';	
	try{
		let poll =  await DB.Models.Poll.findById(pollid);
		if(poll)
		{
			res.send({success:true,data:{poll:poll}});
		}else
		{
			res.status(404).send({success:false,'msg':'Cannot find the poll witht the specified id.'})
		}
	} catch(error)
	{
		console.log('Error fetching poll.',error);
		res.status(500).send({success:false,'msg':'Error fetching poll.'})
	}
});

/**
 * Retrieve a poll based on a poll identifier.
 */
router.get('/:pollid',async(req:Request,res:Response) => {
	const {pollid} = req.params;	
	try{
		let poll =  await DB.Models.Poll.findById(pollid);
		if(poll)
		{			
			res.send({success:true,data:{poll:poll}});
		}else
		{
			res.status(404).send({success:false,'msg':'Cannot find the poll witht the specified id.'})
		}
	} catch(error)
	{
		console.log('Error fetching poll.',error);
		res.status(500).send({success:false,'msg':'Error fetching poll.'})
	}		
});

/**
 * Cast a vote in the poll with the specified poll identifier.
 */
router.post('/:pollid/vote',async(req:Request,res:Response) => {
	const {pollid} = req.params;	
	let {key} = req.body
	let poll:IPoll | null;

	/* Retrieve poll from mongo db.*/
	try{
		poll =  await DB.Models.Poll.findById(pollid);
		if(!poll)
		{			
			res.status(404).send({success:false,'msg':'Cannot find the poll for the specified id.'})
		}
	} catch(error)
	{
		console.log('Error updating votes.',error);
		res.status(500).send({success:false,'msg':'Error updating votes.'})
	}
	
	/* Find the answer key corresponding to the user vote and count the vote.*/
	poll!.answer.some((pollOption:IPollOption)=>{
		if(pollOption.key === key)
		{
			pollOption.votes++;
			return true;
		}
	});
	
	/* Save the update poll information.*/
	await poll!.save((error:any,object:IPoll) => {		
		if(error){
			console.log('Error updating votes.',error);
			res.status(500).send({success:false,'msg':'Error updating votes.'})
			return;
		}

		/* Use a websocket to notify the screen that poll data needs to be refreshed.*/
		req.app.locals.socketUtil.sendMessage(req.app.locals.ws,'POLL_WIDGET',{"widget":"poll",action:'refresh'});
		res.send({success:true,data:{poll:poll}})
	});
});

export = router;