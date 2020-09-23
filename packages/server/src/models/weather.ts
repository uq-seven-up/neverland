import { Schema, model, Document, Model } from 'mongoose';




export declare interface IWeather extends Document{
  _id:string	
  temp: number
  status: string
  fetch_date: Date
}

export interface WeatherModel extends Model<IWeather> {};

export class Weather {
    private _model: Model<IWeather>;
    constructor() {
      const schema = new Schema({
          _id: {type: String},
          temp: { type: Number, required: true },
        status: { type: String , required: true},
        fetch_date:{ type: Date, default: Date.now }
        })

        this._model = model<IWeather>('weather', schema);
    }

  public get model(): Model<IWeather> {
    return this._model
  }
}