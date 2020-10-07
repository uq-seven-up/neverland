import * as Phaser from "phaser";
import AbstractScene from "./AbstractScene"

/**
 * Configuration data expected by the EndScene.
 */
export declare interface EndSceneConfig {
	teamScore:number[]
}

/**
 * Manage the end of the game scene.
 */
export default class EndScene extends AbstractScene  
{
	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config,baseUrl);
	}

	/**
	 * Phaser life cycle method. (This method is called by the Scene Manager when the scene starts, after init() and preload())
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
	 */
	public create(data:EndSceneConfig):void {
		this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0)');
		
		/* Display end game text. */
		this.add.text(500, 300, 'The End', {fontSize: '80px', fill: '#fff'});
		if(data.teamScore[0] > 1)
		{
			this.add.text(400, 400, 'Team One is the Winner', {fontSize: '40px', fill: '#fff'});
		}else{
			this.add.text(400, 400, 'Team Two is the Winner', {fontSize: '40px', fill: '#fff'});
		}
		
		/* Switch to the intro scene after this scene has faded out. */
		let that = this;
		this.cameras.main.on('camerafadeoutcomplete', function () {
			that.scene.start('intro_scene')
		}, this);

		/* Automatically restart the game afer n milliseconds.*/
		this.time.addEvent({delay:3000, 
			callback:this.restart,
			callbackScope:this});

		/* Fade in the end scene. */
		this.cameras.main.fadeIn(1000, 0, 0, 0)
	}

	private restart()
	{
		/* The end of the fade triggers a camera event, defined inside of the create method */
		this.cameras.main.fade(2000, 0, 0, 0);
	}
}