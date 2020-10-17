import { Schema, model, Document, Model } from 'mongoose';

export declare interface ILeaderboard extends Document {	
  name: any
  score: any
}

export interface LeaderboardModel extends Model<ILeaderboard> {};


export class Leaderboard {
    private _model: Model<ILeaderboard>;

    constructor() {
        const schema =  new Schema({
          name: { type: String, required: true },
          score: { type: Number, required: true }
        });

        this._model = model<ILeaderboard>('leaderboard', schema);
    }

    public get model(): Model<ILeaderboard> {
        return this._model
    }
}