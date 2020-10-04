import dotenv from "dotenv";
import { connect, connection, Connection } from 'mongoose';
import { Example, ExampleModel } from '../models/example';
import { Poll, PollModel } from '../models/poll';
import { RssFeed, RssFeedModel } from '../models/rss';
import { BusTime, BusTimeModel } from '../models/bus-time';
import { Weather, WeatherModel } from '../models/weather';

/* Retrieve mongo db credentials from environment variables. */
const _env = dotenv.config()
const MONGO_SERVER = process.env.mongoserver as string;
const MONGO_USERNAME = process.env.mongousername as string;
const MONGO_PASSWORD = process.env.mongopassword as string;
const MONGO_DBNAME = process.env.mongodbname as string;
/* The connection string for localhost is different to connecting to mongo hosted on Atlas.*/
const MONG_URL = MONGO_SERVER === 'localhost' ? `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_SERVER}/${MONGO_DBNAME}?authSource=admin` : `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_SERVER}/${MONGO_DBNAME}?retryWrites=true&w=majority`

/* Interface for valid mongoose data models. */
declare interface IModels {
	Example: ExampleModel,
	RssFeed:RssFeedModel,
	Poll:PollModel,
    BusTime: BusTimeModel,
    Weather: WeatherModel
}

/**
 * The Db class manages mongo db connections. 
 * DB is implemented as a singleton.
 */
export class DB {
    private static instance: DB;
    private _db: Connection; 
    private _models: IModels;

    private constructor() {
        connect(MONG_URL, { useNewUrlParser: true,useUnifiedTopology: true });
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

		// Register defined data model definitions.
        this._models = {
			Example: new Example().model,
			Poll: new Poll().model,
			RssFeed: new RssFeed().model,
            BusTime: new BusTime().model,
            Weather: new Weather().model
		}
    }

	/**
	 * Implement singleton pattern.
	 */
	public static get Models() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance._models;
    }

	/**
	 * life-cycle event, called when a connection to mongo db is established.
	 */
    private connected() {
        console.log('Mongoose has connected');
    }

	/**
	 * life-cycle event, called when a mongo db connection error occurs.
	 */
    private error(error:any) {
        console.log('Mongoose has errored', error);
    }
}