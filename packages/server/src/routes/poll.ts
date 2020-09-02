import * as express from 'express';
import { Request, Response } from "express";
import RSSParser = require('rss-parser');
import dotenv from "dotenv";
import {DB} from '../controller/db'
import { IRssFeed} from '../models/rss';

/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();

router.get('/:pollid',async(req:Request,res:Response) => {
	const {pollid} = req.params;
	res.send({success:true,data:{msg:'get',id:pollid},cached:false})	
});

router.post('/:pollid/vote',async(req:Request,res:Response) => {
	const {pollid} = req.params;
	res.send({success:true,data:{msg:"vote",id:pollid},cached:false})	
});

export = router;