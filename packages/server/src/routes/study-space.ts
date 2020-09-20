const puppeteer = require('puppeteer');
import * as express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

interface LibrarySpaceObject {
	[key: string]: string;
}

/**
 * Defines routes which are intended to be used to provide
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();

router.get('/availability-data/', async (req: Request, res: Response) => {
	const link = 'https://www.library.uq.edu.au/';

	const browser = await puppeteer.launch({
		headless: true,
		slowMo: 100,
		devtools: true,
	});

	try {
		const page = await browser.newPage();
		const librarySpaceAvailability: LibrarySpaceObject = {};

		await page.goto(link);

		await page.waitForSelector('#computersList .paper-item-0');

		// Extract the space availability information from the site
		const librarySpace = await page.evaluate(() => {
			const rowNodeList = document.querySelectorAll(
				'#computersList .paper-item-0 .computers-available',
			);
			const rowArray = Array.from(rowNodeList);
			let links = rowArray.map((element) => {
				const librarySpaceText = (element as HTMLElement).innerText.split(
					' free of ',
				);
				return Math.floor(
					(parseFloat(librarySpaceText[0]) / parseFloat(librarySpaceText[1])) *
						100,
				);
			});
			return links;
		});

		// Extract the library name information from the site
		const libraryName = await page.evaluate(() => {
			const rowNodeList = document.querySelectorAll(
				'#computersList .paper-item-0 .linked-item',
			);
			const rowArray = Array.from(rowNodeList);
			let links = rowArray.map((element) => {
				return (element as HTMLElement).innerText;
			});
			return links;
		});

		libraryName.forEach((library: string | number, index: string | number) => {
			librarySpaceAvailability[library] = librarySpace[index];
		});

		await page.close();
		await browser.close();

		res.send({ success: true, data: librarySpaceAvailability });
	} catch (error) {
		console.log(error);
		await browser.close();
	}
});

export = router;
