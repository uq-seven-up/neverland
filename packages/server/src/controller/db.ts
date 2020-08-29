import { connect, connection, Connection } from 'mongoose';
import { Example, ExampleModel } from '../models/example';
import dotenv from "dotenv";

const _env = dotenv.config()
const MONGO_SERVER = process.env.mongoserver as string;
const MONGO_USERNAME = process.env.mongousername as string;
const MONGO_PASSWORD = process.env.mongopassword as string;
const MONGO_DBNAME = process.env.mongodbname as string;
const MONG_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_SERVER}/${MONGO_DBNAME}?retryWrites=true&w=majority`

declare interface IModels {
	Example: ExampleModel
}

export class DB {
    private static instance: DB;
    private _db: Connection; 
    private _models: IModels;

    private constructor() {
        connect(MONG_URL, { useNewUrlParser: true,useUnifiedTopology: true });
        this._db = connection;
        this._db.on('open', this.connected);
        this._db.on('error', this.error);

        this._models = {
			// This is where we initialise all models.
            Example: new Example().model
		}
    }

    public static get Models() {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance._models;
    }

    private connected() {
        console.log('Mongoose has connected');
    }

    private error(error:any) {
        console.log('Mongoose has errored', error);
    }
}