import * as express from 'express';
import { Request, Response } from "express";
import dotenv from "dotenv";
import {DB} from '../controller/db'

interface BusTime {
	stop_id: number,
	route_id: number;
    trip_id: string;
    departure_time: string;
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
    // Date object initialized as per Brisbane timezone. Returns a datetime string
    let brisbane_date_string = new Date().toLocaleString("en-US", { timeZone: "Australia/Brisbane" });
    let today = new Date(brisbane_date_string);
    

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
    var bus_times: BusTime[] = [];
    var today: Date = new Date();
    today.setTime(today.getTime() + (10*60*60*1000));
    const FILTER = {
        "trip_id" : get_filter(day),
        "stop_id":{$in:get_stop_ids(stop)}
    }
    
    try {
        await DB.Models.BusTime.find(FILTER, (err, results) => {
            if (err) throw err;
            var counter = 0;
            for(var i = 0; i < results.length; i++) {
                var row: any = results[i];
                var splitTime: string[] = row.departure_time.split(':');
                var parsedDate: Date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(splitTime[0]), parseInt(splitTime[1]));
                if(parsedDate >= today) {
                    var dateString = parsedDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    var bus_time: BusTime = {
						stop_id: row.stop_id,
						route_id: row.route_id.split('-')[0],
                        departure_time: dateString,
                        trip_id: row.trip_id,
                        trip_headsign: row.trip_headsign
                    };

                    var alreadyIn = bus_times.filter(x => x.route_id === bus_time.route_id && x.departure_time === bus_time.departure_time);

                    if(alreadyIn.length !== 0) {
                        continue;
                    }

                    bus_times.push(bus_time);
                    counter++;

                    if(counter > 5){
                        break;
                    }
                }
            }

            res.send({success:true,data:bus_times});
        })	
    } catch (error) {
        console.log(error);
        express.response.sendStatus(500)
    }
});

function get_stop_ids(stop: any) {
    var result: number[]=[];
    switch(stop) {
        case "uqlakes":
            result = [1853, 1877, 1878, 1880, 1883];
        break;
        case "chancellor":
            result = [1802, 1797, 1798, 1799, 1801];
        break;
    }

    return result;
}

function get_filter(day: any) {
    if(day === "Weekday") {
        return /.*Weekday./;
    }
    else if(day === "Saturday"){
        return /.*.Saturday./;
    }
    else {
        return /.*Sunday./;
    }
}

export = router;