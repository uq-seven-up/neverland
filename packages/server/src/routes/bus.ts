import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";
import {DB} from '../controller/db'

interface BusTime {
	stop_id: number,
	route_id: number;
    trip_id: string;
    departure_date: string;
    trip_headsign: string;
}

/**
 * Defines routes which are intended to be used to provide 
 * data to the display screen.
 */
const router = express.Router();
dotenv.config();


/**
 * Returns bus times for UQ Lakes (still need to implement method for chancellor's place)
 */
router.get('/get-bus-times/',async(req:Request,res:Response) => {
    const url = require('url');
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
        case 0:
            redirectValue = "Sunday";
            break;
    }
    
    res.redirect(url.format({
        pathname: "translink-times",
        query: {
            "stop": req.query["stop"],
            "day": redirectValue
        }
    }));
});

router.get('/translink-times/', async(req:Request,res:Response) => {
    var stop = req.query.stop;
    var day = req.query.day;

    const sqlite3 = require('sqlite3').verbose();
	let db = new sqlite3.Database('C:\\Projects\\neverland_database\\gtfs.db', (err: { message: any; }) => {
		if (err) {
			return console.error(err.message);
		}
		
		console.log('Connected to the gtfs SQlite database.');
    });
    var bus_times: BusTime[] = [];
    var today: Date = new Date();

    let sql = `SELECT t.route_id, t.trip_headsign,st.stop_id, st.departure_time, st.trip_id FROM stop_times AS st, trips AS t
                WHERE st.stop_id IN (`;
    sql += get_stop_ids(stop);
    sql +=`) AND st.trip_id LIKE '%` + day + `%'
                AND st.trip_id = t.trip_id
                ORDER BY st.departure_time`;

	try{
		await db.all(sql, [], (err: any, rows: any)=>{
            if(err){
                throw err;
            }
            var counter = 0;
            for(var i = 0; i < rows.length; i++) {
                
                var row: any = rows[i];
                var splitTime: string[] = row.departure_time.split(':');
                var parsedDate: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(splitTime[0]), parseInt(splitTime[1]), parseInt(splitTime[2]));
                
                if(parsedDate >= today) {
                    var dateString = parsedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    var bus_time: BusTime = {
						stop_id: row.stop_id,
						route_id: row.route_id.split('-')[0],
                        departure_date: dateString,
                        trip_id: row.trip_id,
                        trip_headsign: row.trip_headsign
                    };
                    bus_times.push(bus_time);
                    counter++;
                    if(counter > 5){
                        break;
                    }
                }
            }

            res.send({success:true,data:bus_times});
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

function get_stop_ids(stop: any) {
    var result: string = "";
    switch(stop) {
        case "uqlakes":
            result = `'1853', '1877', '1878', '1880', '1883'`;
        break;
        case "chancellor":
            result = `'1802', '1797', '1798', '1799', '1801'`;
        break;
    }

    return result;
}

export = router;