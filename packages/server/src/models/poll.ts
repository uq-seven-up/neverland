import { Schema, model, Document, Model } from 'mongoose';

declare interface IPollOption{
    key: string
    response: string
    votes: number
}

export declare interface IPoll extends Document{	
	_id:string,
	name: string
    published_date: Date
	question: string,
	answer: IPollOption[]
    creation_date: Date
}

export interface PollModel extends Model<IPoll> {};

export class Poll {
    private _model: Model<IPoll>;

    constructor() {
        const schema =  new Schema({
			_id: String,
			name: { type: String, required: true },
            published_date: { type: String, required: true },
            question: { type: String,required: true},
            answer: [{
				key:{type: String, required: true},
				response:{type: String, required: true},
				votes:{type: Number, required: true, default: 0}
			}],
            creation_date: { type: Date, default: Date.now }
        });

        this._model = model<IPoll>('poll', schema);
    }

    public get model(): Model<IPoll> {
        return this._model
    }
}