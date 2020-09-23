import { Schema, model, Document, Model } from 'mongoose';

declare interface IWeather extends Document{
  temp: number,
  state: string
}

export interface WeatherModel extends Model<IWeather> {};

export class Weather {
    private _model: Model<IWeather>;

    constructor() {
        const schema =  new Schema({
          temp: {type: Number},
          state: { type: String } 
        });

        this._model = model<IWeather>('weather', schema);
    }

  public get model(): Model<IWeather> {
    return this._model
  }
}