import * as Phaser from "phaser";

declare interface EndSceneConfig {
	teamScore:number[]
}

export default class EndScene extends Phaser.Scene  
{
	private BASE_URL:string;
	private timeEvent!:Phaser.Time.TimerEvent;

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

	public create(data:EndSceneConfig):void {
		let that = this;

		this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0)');
		this.cameras.main.on('camerafadeoutcomplete', function () {
			that.scene.start('intro_scene')
		}, this);

		this.add.text(500, 300, 'The End', {fontSize: '80px', fill: '#fff'});

		if(data.teamScore[0] > 1)
		{
			this.add.text(400, 400, 'Team One is the Winner', {fontSize: '40px', fill: '#fff'});
		}else{
			this.add.text(400, 400, 'Team Two is the Winner', {fontSize: '40px', fill: '#fff'});
		}
		

		this.timeEvent = this.time.addEvent({delay:3000, 
											callback:this.restart,
											callbackScope:this});
	}

	public update():void{
	
	}
}