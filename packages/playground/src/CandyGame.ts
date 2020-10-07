import * as Phaser from "phaser";
import EndScene from "./scene/EndScene";
import GameScene from "./scene/GameScene";
import IntroScene from "./scene/IntroScene";


export default class CandyGame extends Phaser.Game{
	private ws!:WebSocket;
	private BASE_URL = '/client-screen/game';
	private SOCKET_URL = 'ws://' + window.location.hostname + ':3080/?uuid=GAME_SCREEN';

	constructor(config:Phaser.Types.Core.GameConfig){
		super(config);
		if(process.env.NODE_ENV === 'development')
		{
			this.BASE_URL = '';			
		}
		
		let introScene = new IntroScene({},this.BASE_URL);
		this.scene.add('intro_scene',introScene,false);
		
		let gameScene = new GameScene({},this.BASE_URL);
		this.scene.add('game_scene',gameScene,true);

		let endScene = new EndScene({},this.BASE_URL);
		this.scene.add('end_scene',endScene,false);
	}

	public boot()
	{
		super.boot();
		this.connect();
	}

	private connect = () => {
		this.ws = new WebSocket(this.SOCKET_URL);
		
		this.ws.onopen = () => {
			console.log('Game connected to socket server.')
		}

		this.ws.onmessage = (evt:any) => {			
			const message = evt.data.toString();
			if(!message.startsWith('g|')) return;
			
			if(this.scene.isActive('game_scene'))
			{
				let scene = this.scene.getScene('game_scene') as GameScene;
				scene.processSocketMessage(message);
			}

			if(this.scene.isActive('intro_scene'))
			{
				let scene = this.scene.getScene('intro_scene') as IntroScene;
				scene.startGame();
			}
		}

		this.ws.onclose = () => {
			let that = this;
			console.log('Screen disconnected, retry reconnect in two seconds.')	
			setTimeout(function() {
			that.connect();
			}, 2000);		
		}
	}

	public sendEventToPlayer(playerId:string,eventId:number)
	{
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(`c|v|${playerId}|${eventId}|`);
		}
	}

	public sendEventAllPlayers(eventId:number)
	{
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(`b|v||${eventId}|`);
		}
	}
}