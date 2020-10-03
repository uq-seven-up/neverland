import { Schema, model, Document, Model } from 'mongoose';

/* Define the mongo db schema for caching a RSS Feed.*/

declare interface IRssItem{
	creator: string
    title: string
    link: string
	pubDate: string
	content: string
	contentSnippet: string
	guid: string
    isoDate: Date
}

export declare interface IRssFeed extends Document{
	_id:string,	
	items: IRssItem[]
    fetch_date: Date
}

/**
 * RssFeedModel, defines the schema for caching retrieved RSS feeds
 * inside of mongo db. Specifically the UQ rss feed.
 */
export interface RssFeedModel extends Model<IRssFeed> {};

export class RssFeed {
    private _model: Model<IRssFeed>;

    constructor() {
        const schema= new Schema({
			_id: String,
			items: [
				{					
					creator: { type: String},
					title: { type: String},
					link: { type: String },
					pubDate: { type: Date},
					content: { type: String },
					contentSnippet: { type: String },
					guid:{ type: String },
					isoDate: { type: Date}
				}
			],
			fetch_date:{ type: Date, default: Date.now }
		})

        this._model = model<IRssFeed>('uqrss', schema);
    }

    public get model(): Model<IRssFeed> {
        return this._model
    }
}