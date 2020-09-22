import { Schema, model, Document, Model } from 'mongoose';

declare interface IWeather extends Document{
  main: { temp: number,}
  weather: [{ main: string}]
}

export interface WeatherModel extends Model<IWeather> {};

export class Weather {
    private _model: Model<IWeather>;

    constructor() {
        const schema =  new Schema({
          main: { temp: {type: Number}},
          weather: [{ main: { type: String } }]
        });

        this._model = model<IWeather>('weather', schema);
    }

    public get model(): Model<IWeather> {
        return this._model
    }
}