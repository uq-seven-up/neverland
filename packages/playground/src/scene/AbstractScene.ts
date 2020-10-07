import * as Phaser from "phaser";
import CandyGame from "../CandyGame";

export declare interface AssetItem {
	type:'image'|'atlas'|'map',
	src:string,
	ref?:string
}

/**
 * Abstract class for functionality which is usefull for all scenes.
 */
export default class AbstractScene extends Phaser.Scene
{
	/**
	 * Defines the location from which assets will be loaded.
	 */
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

	protected sendEventToPlayers(playerId:string,eventId:number){
		(this.game as CandyGame).sendEventToPlayer(playerId,eventId);
	}

	protected sendEventToAllPlayers(eventId:number){
		(this.game as CandyGame).sendEventAllPlayers(eventId);
	}
}