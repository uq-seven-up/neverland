import { Schema, model, Document, Model } from 'mongoose';

/* Define the mongo db schema for storing a Example Document.*/

declare interface IExample extends Document{
    name: string
    email: string
    phone?: string
    message?: string
    creation_date: Date
}

export interface ExampleModel extends Model<IExample> {};

/**
 * Example, is a reference implementation that we built as a first
 * proof of concept for storing / retrieving data from mongo db
 * using node.
 */
export class Example {
    private _model: Model<IExample>;

    constructor() {
        const schema =  new Schema({
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String },
            message: { type: String },
            creation_date: { type: Date, default: Date.now }
        });

        this._model = model<IExample>('example', schema);
    }

    public get model(): Model<IExample> {
        return this._model
    }
}