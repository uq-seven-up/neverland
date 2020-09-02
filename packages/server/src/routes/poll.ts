import * as express from 'express';
import { Request, Response } from "express";
import RSSParser = require('rss-parser');
import dotenv from "dotenv";
import {DB} from '../controller/db'
import { IPoll} from '../models/poll';
import {CFKitUtil} from '@7up/common-utils'

/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();


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
			res.status(500).send({success:false,'msg':'Error creating poll.',error:error})
			return;
		}

		res.send({success:true,data:{poll:poll}})
	});
});


router.get('/:pollid',async(req:Request,res:Response) => {
	const {pollid} = req.params;	
	try{
		let poll =  await DB.Models.Poll.findById(pollid);
		if(poll)
		{
			res.send({success:true,data:{poll:poll}});
		}else
		{
			res.status(404).send({success:false,'msg':'Can not find poll for the specified id.'})
		}
	} catch(error)
	{
		console.log('Error fetching RSS cache.');
		res.status(500).send({success:false,'msg':'Error fetching RSS cache.',error:error})
	}		
});


router.post('/:pollid/vote',async(req:Request,res:Response) => {
	const {pollid} = req.params;	
	let poll:IPoll | null;

	try{
		poll =  await DB.Models.Poll.findById(pollid);
		if(!poll)
		{			
			res.status(404).send({success:false,'msg':'Can not find poll for the specified id.'})
		}
	} catch(error)
	{
		console.log('Error updating votes.');
		res.status(500).send({success:false,'msg':'Error updating votes.',error:error})
	}
	

	poll!.answer[0].votes = poll!.answer[0].votes + 1;
	
	await poll!.save((error:any,object:IPoll) => {		
		if(error){
			res.status(500).send({success:false,'msg':'Error updating votes.',error:error})
			return;
		}

		res.send({success:true,data:{poll:poll}})
	});
});

export = router;