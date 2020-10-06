import * as Phaser from "phaser";
import {CandyGame} from "../app";

const backgroundImg = require('../assets/intro_background.png');

export default class IntroScene extends Phaser.Scene  
{
	private BASE_URL:string;

	

	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config);
		this.BASE_URL = baseUrl;
	}

	public preload():void {		
		this.load.setBaseURL(this.BASE_URL);

		this.load.image('background',backgroundImg);
	}

	public startGame()
	{
		this.cameras.main.fade(2000, 0, 0, 0);
	}
	
	public create():void {
		let that = this;

		this.add.image(704,352,'background')

		this.cameras.main.on('camerafadeoutcomplete', function () {
			that.scene.start('game_scene')
        	}, this);

		this.input.once('pointerdown', function (e:Phaser.Input.Pointer) {
            that.startGame();
        }, this);
	}

	public update():void{
	
	}
}
