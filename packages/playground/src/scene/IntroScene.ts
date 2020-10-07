import * as Phaser from "phaser";

const backgroundImg = require('../assets/intro_background.png');

export default class IntroScene extends Phaser.Scene  
{
	private BASE_URL:string;

	

	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config);
		this.BASE_URL = baseUrl;
	}

	/**
	 * Phaser life cycle method. (This method is called by the Scene Manager, after init() and before create())
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback
	 */	
	public preload():void {		
		this.load.setBaseURL(this.BASE_URL);

		this.load.image('background',backgroundImg);
	}

	/**
	 * Phaser life cycle method. (This method is called by the Scene Manager when the scene starts, after init() and preload())
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
	 */
	public create():void {
		this.add.image(704,352,'background')
		
		let that = this;

		this.cameras.main.on('camerafadeoutcomplete', function () {
			that.scene.start('game_scene')
        	}, this);

		this.input.once('pointerdown', function (e:Phaser.Input.Pointer) {
            that.startGame();
		}, this);
		
		this.cameras.main.fadeIn(400, 0, 0, 0)
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
