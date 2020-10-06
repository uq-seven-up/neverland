import * as Phaser from "phaser";

export default class EndScene extends Phaser.Scene  
{
	private BASE_URL:string;

	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config);
		this.BASE_URL = baseUrl;
	}

	public restart()
	{
		this.cameras.main.fade(2000, 0, 0, 0);
	}

	public preload():void {		
		this.load.setBaseURL(this.BASE_URL);
	}

	public create():void {
		let that = this;

		this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0)');
		this.cameras.main.on('camerafadeoutcomplete', function () {
			that.scene.start('intro_scene')
        	}, this);

		this.add.text(500, 300, 'The End', {fontSize: '80px', fill: '#fff'});


		this.input.once('pointerdown', function (e:Phaser.Input.Pointer) {
            that.restart();
        }, this);
	}

	public update():void{
	
	}
}