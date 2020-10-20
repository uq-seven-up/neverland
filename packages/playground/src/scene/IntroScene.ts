import * as Phaser from "phaser";
import AbstractScene from "./AbstractScene"
import {AssetItem} from "./AbstractScene"

/* Define assets which need to be loaded for this scene. */
const ASSET:Map<string,AssetItem> = new Map();
ASSET.set('background',{type:'image',src:require('../assets/intro_background.png')});
ASSET.set('txt_vs',{type:'image',src:require('../assets/txt_vs.png')});
ASSET.set('txt_battle',{type:'image',src:require('../assets/txt_battle.png')});

/**
 * Manage the introduction (splash screen) scene.
 */
export default class IntroScene extends AbstractScene 
{
	
	private _vsSprite!:Phaser.Physics.Arcade.Sprite;
	private _logoSprite!:Phaser.Physics.Arcade.Sprite;
	
	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config,baseUrl);
	}

	/**
	 * Phaser life cycle method. (This method is called by the Scene Manager, after init() and before create())
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback
	 */	
	public preload():void {		
		this.assetLoader(ASSET);
	}

	/**
	 * Phaser life cycle method. (This method is called by the Scene Manager when the scene starts, after init() and preload())
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
	 */
	public create():void {
		this.add.image(704,352,'background');
		
		
		this._logoSprite = this.physics.add.sprite(700,80,'txt_battle');
		this._vsSprite = this.physics.add.sprite(750,380,'txt_vs');

		/* Switch to the game scene after this scene has faded out. */
		let that = this;
		this.cameras.main.on('camerafadeoutcomplete', function () {
			that.scene.start('game_scene')
        	}, this);

		/* For debugging, a mouse click / tap on the display also starts the game. */
		this.input.once('pointerdown', function (e:Phaser.Input.Pointer) {
            that.startGame();
		}, this);
	
		/* Fade in the intro scene. */
		this.cameras.main.fadeIn(400, 0, 0, 0)

		this._logoSprite.setAlpha(0.2);
		this._vsSprite.setAlpha(0.2);
		this.tweens.add({
			targets: [this._logoSprite,this._vsSprite],
			alpha: 1,
			duration: 700,
			yoyo:true,
			loop:1000
		});
	}

	/**
	 * Start running the game scene.
	 */
	public startGame()
	{
		/* The end of the fade triggers a camera event, defined inside of the create method */
		this.cameras.main.fade(1000, 0, 0, 0);
	}	
}
