import * as express from 'express';
import { Request, Response } from "express";
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
 * 
 * Expects to receive a JSON object in the following format:
 * {
 *   "name":"q1",
 *   "question":"How has your day been so far?",
 *   "answer":[
 *       {"key":"a","response":"Very good!","votes":0},
 *       {"key":"b","response":"Worse day of my life!","votes":0},
 *       {"key":"c","response":"Too many assignments!","votes":0},
 *       {"key":"d","response":"I got this!","votes":0}
 *   ]
 * }
 */
router.post('/create',async(req:Request,res:Response) => {	
	let poll = new DB.Models.Poll();
	poll._id = CFKitUtil.createGUID();
	poll.name = req.body.name;
	poll.published_date = new Date();
	poll.question = req.body.question;
	poll.creation_date = new Date();
	for(let i=0; i < req.body.answer.length;i++){
		poll.answer.push({
			key:req.body.answer[i].key,
			response:req.body.answer[i].response,
			votes:req.body.answer[i].votes
		});
	}
	
	await poll.save((error:any,object:IPoll) => {		
		if(error){
			console.log(error)			
			res.status(500).send({success:false,'msg':'Error creating poll.'})
			return;
		}
		res.send({success:true,data:{poll:object}})
	});
});


/**
 * Retrieve the currently active poll.
 */
router.get('/active',async(req:Request,res:Response) => {	
	try{
		let poll =  await DB.Models.Poll.find().sort({creation_date:-1}).limit(1);
		if(poll && poll.length > 0)
		{
			res.send({success:true,data:{poll:poll[0]}});
		}else
		{
			res.status(404).send({success:false,'msg':'Did not find any active polls.'})
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
		SocketUtil.sendMessage(req.app.locals.ws,'POLL_WIDGET',{"widget":"poll",action:'refresh'});
		res.send({success:true,data:{poll:poll}})
	});
});

export = router;