import * as express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import {DB} from '../controller/db'
import { ILeaderboard } from '../models/leaderboard';

var seedingData = [
	{ 
		name: "7Up",
		score: 10
	},

	{ 
		name: "Inconcievables",
		score: 15
	},

	{ 
		name: "Dealbreakers",
		score: 5
	},
	
	{ 
		name: "Hotshots",
		score: 25
	},

	{ 
		name: "Avengers",
		score: 40
	},
];


/**
 * Leaderboard Model
 */
const Leaderboard = DB.Models.Leaderboard;

/**
 * Defines routes which are intended to be used to provide
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();

/**
 * Retrieves all the team names and scores
 */
router.get('/scores', async (req: Request, res: Response) => {
	let dataCount = await Leaderboard.countDocuments([], (err, count) => count);
	
	// Seeds data to the leaderboard collection if it is empty
	if (dataCount == 0) {
		seedingData.forEach((seedTeam)=> {
			let leaderboard = new Leaderboard();

			leaderboard.name = seedTeam.name;
			leaderboard.score = seedTeam.score;
					
			leaderboard.save((error:any, object:ILeaderboard) => {		
				if(error){
					res.status(500).send({success:false,'msg':'Error adding seeding team.'})
				}	
			});
		})
	}

	try {
		await Leaderboard.find({}, (err: any, foundTeamScores: any) => {
			if (err) {
				res.send({ success:false,'msg':err });
			} else {
				res.send({ success:true, data:foundTeamScores });
			}
		});
	} catch (error) {
		res.status(500).send({success:false,'msg':'Error fetching leaderboard scores.'})
	}

});

/**
 * Posts team name and score to the database
 */
router.post('/scores', async (req: Request, res: Response) => {	
	let leaderboard = new Leaderboard();

	leaderboard.name = req.query.name;
	leaderboard.score = req.query.score;

	await leaderboard.save((error:any, object:ILeaderboard) => {		
		if(error){
			res.status(500).send({success:false,'msg':'Error adding team details.'})
			return;
		}
		res.send({success:true,data:{leaderboard:object}})
	});
});

/**
 * Deletes all the team details
 */
router.delete('/scores', async (req: Request, res: Response) => {	
	await Leaderboard.deleteMany({}, (err: any) => {
		if (err) {
			res.send({success:false,'msg':err});
		} else {
			res.send({success:true});
		}
	});
});


export = router;
