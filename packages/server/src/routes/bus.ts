import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";
import {DB} from '../controller/db'
import {IBusTime} from '../models/bus-time';
/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();


/**
 * Returns bus times for UQ Lakes (still need to implement method for chancellor's place)
 */
router.get('/get-bus-times',async(req:Request,res:Response) => {
    var today: Date = new Date();
    var redirectValue: string = "";

    switch(today.getDay()) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            redirectValue = "Weekday";
            break;
        case 6:
            redirectValue = "Saturday"
            break;
        case 7:
            redirectValue = "Sunday";
            break;
    }
    
    res.redirect("translink-times/"+ redirectValue);
});

router.get('/translink-weekday', async(req:Request,res:Response) => {
    const sqlite3 = require('sqlite3').verbose();
	let db = new sqlite3.Database('C:\\Projects\\neverland_database\\gtfs.db', (err: { message: any; }) => {
		if (err) {
			return console.error(err.message);
		}
		
		console.log('Connected to the gtfs SQlite database.');
    });
    var trip_ids: string[] = [];
    var bus_times: IBusTime[] = [];
    var today: Date = new Date();

    let sql = `SELECT t.route_id, t.trip_headsign, st.departure_time, st.trip_id FROM stop_times AS st, trips AS t
                WHERE st.stop_id IN (
                    '1853',
                    '1877',
                    '1878',
                    '1880',
                    '1883')
                AND st.trip_id LIKE '%Weekday%'
                AND st.trip_id = t.trip_id
                ORDER BY st.departure_time`;

	try{
		await db.all(sql, [], (err: any, rows: any)=>{
            if(err){
                throw err;
            }

            rows.forEach((row: any) =>{
                // console.log(row.route_id + " | " + row.trip_id + " | " + row.departure_time + " | " + row.trip_headsign);
                trip_ids.push(row.trip_id);
                var splitTime: string[] = row.departure_time.split(':');
                var parsedDate: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(splitTime[0]), parseInt(splitTime[1]), parseInt(splitTime[2]));
                
                if(parsedDate >= today) {
                    var bus_time: IBusTime = {
                        route_id: row.route_id,
                        departure_date: parsedDate,
                        trip_id: row.trip_id,
                        trip_headsign: row.trip_headsign
                    };
                    bus_times.push(bus_time);
                }
            });
            
            res.send(JSON.stringify(bus_times));
        })
	} catch(err) {
		console.error(err);
    };
});

router.get('/translink-times/:day', async(req:Request,res:Response) => {
    const {day} = req.params;
    const sqlite3 = require('sqlite3').verbose();
	let db = new sqlite3.Database('C:\\Projects\\neverland_database\\gtfs.db', (err: { message: any; }) => {
		if (err) {
			return console.error(err.message);
		}
		
		console.log('Connected to the gtfs SQlite database.');
    });
    var bus_times: IBusTime[] = [];
    var today: Date = new Date();

    let sql = `SELECT t.route_id, t.trip_headsign, st.departure_time, st.trip_id FROM stop_times AS st, trips AS t
                WHERE st.stop_id IN (
                    '1853',
                    '1877',
                    '1878',
                    '1880',
                    '1883')
                AND st.trip_id LIKE '%` + day + `%'
                AND st.trip_id = t.trip_id
                ORDER BY st.departure_time`;

	try{
		await db.all(sql, [], (err: any, rows: any)=>{
            if(err){
                throw err;
            }

            rows.forEach((row: any) =>{
                // console.log(row.route_id + " | " + row.trip_id + " | " + row.departure_time + " | " + row.trip_headsign);
                var splitTime: string[] = row.departure_time.split(':');
                var parsedDate: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(splitTime[0]), parseInt(splitTime[1]), parseInt(splitTime[2]));
                
                if(parsedDate >= today) {
                    var bus_time: IBusTime = {
                        route_id: row.route_id,
                        departure_date: parsedDate,
                        trip_id: row.trip_id,
                        trip_headsign: row.trip_headsign
                    };
                    bus_times.push(bus_time);
                }
            });
            
            res.send(JSON.stringify(bus_times));
        })
	} catch(err) {
		console.error(err);
    };
});

router.get('/translink-init',async(req:Request,res:Response) => {
	const gtfs = require('gtfs');
	
	const config = require('../../translinkconfig.json');
	
	gtfs.import(config)
        .then(() => {
        console.log('Import Successful');
        })
        .catch((err: any) => {
        console.error(err);
        });
        
	res.send("Importing data!");
});

export = router;