import * as Phaser from "phaser";
import CandyGame from "../CandyGame";

/** Defines the properties need by the asset loaded when loading a asset. */
export declare interface AssetItem {
	type:'atlas'|'image'|'map',
	src:string,
	ref?:string /* A reference to a previously loaded image, only required for atlas assets.  */
}

/**
 * Abstract class for functionality which is usefull for all scenes.
 */
export default class AbstractScene extends Phaser.Scene
{
	/** URL prefix used when loading scene assets.*/
	protected BASE_URL:string;

	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config);
		this.BASE_URL = baseUrl;
	}

	/**
	 * Helper method which simplifies loading scene assest such as images, atlases, and maps.
	 * 
	 * See the GameScene for an example definition.
	 * @param asset A map where each key is an Asset Item.
	 */
	protected assetLoader(asset:Map<string,AssetItem>){
		this.load.setBaseURL(this.BASE_URL);

		/* Load asset catalog. */
		asset.forEach((item:AssetItem,key:string) => {
			switch(item.type)
			{
				case 'atlas':
					this.load.atlas(key,asset.get(item.ref!)?.src,item.src);
				break;
				
				case 'image':
					this.load.image(key,item.src);
				break;
				
				case 'map':
					this.load.tilemapTiledJSON(key,item.src);
				break;
			}
		});
	}

	/**
	 * Convenience method for sending a game event to a specific. Player.
	 * 
	 * For an overview of event types see the comments in.
	 * packages/server/src/lib/GameServer.ts
	 * 
	 * @param playerId The player id which should receive the message.
	 * @param eventId The event id which is send to the players client.
	 */
	protected sendEventToPlayer(playerId:string,eventId:number){
		(this.game as CandyGame).sendEventToPlayer(playerId,eventId);
	}

	/**
	 * Convenience method for broadcasting a game event to all players.
	 * 
	 * For an overview of event types see the comments in.
	 * packages/server/src/lib/GameServer.ts
	 * 
	 * @param eventId The event id which is send to the players client.
	 */
	protected sendEventToAllPlayers(eventId:number){
		(this.game as CandyGame).sendEventToAllPlayers(eventId);
	}
}