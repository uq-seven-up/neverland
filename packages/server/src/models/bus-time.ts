import { Schema, model, Document, Model } from 'mongoose';

export declare interface IBusTime extends Document {
	stop_id: number,
	route_id: string;
    trip_id: string;
    departure_time: string;
    trip_headsign: string;
}

export interface BusTimeModel extends Model<IBusTime> {};

export class BusTime {
    private _model: Model<IBusTime>;

    constructor() {
        const schema =  new Schema({
			stop_id: { type: Number, required: true },
            route_id: { type: String, required: true },
            trip_id: { type: String },
            departure_time: { type: String },
            trip_headsign: { type: String}
        });

        this._model = model<IBusTime>('bustime', schema);
    }

    public get model(): Model<IBusTime> {
        return this._model
    }
}