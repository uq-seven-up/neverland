import * as express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
const fetch = require('node-fetch');

async function fetchLibraryCapacity() {
	const libraryGUID: any = {
		'Arch Music': ['SXO0AZgR6y9jDdN', 75],
		'Biol Sci': ['paaPDlMginYuHMx', 375],
		Central: ['8DXPwOaTWeBYNbS', 550],
		DHEngSci: ['c2JHW7feDz0xVik', 200],
		DuhigStudy: ['RNEF5b016mfJou3', 260],
		'Law Library': ['hMxSjYuk4v3kuIx', 109],
	};

	for (let library in libraryGUID) {
		const response = await fetch(
			`https://l.vemcount.com/embed/data/${libraryGUID[library][0]}`,
		);

		const libraryCapacity = await response.json();
		const libraryValue = libraryCapacity.value;

		libraryGUID[library] = Math.round(
			(libraryValue / libraryGUID[library][1]) * 100,
		);
	}

	return libraryGUID;
}

/**
 * Defines routes which are intended to be used to provide
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();

router.get('/availability-data/', async (req: Request, res: Response) => {
	fetchLibraryCapacity().then((libraryDict) => {
		res.send({ success: true, data: libraryDict });
	});
});

export = router;
