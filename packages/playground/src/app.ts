import * as Phaser from "phaser";
import MainWorldScene from "./scene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1400,
	height: 704,
	physics: {
		default: 'arcade',
		arcade: {
			debug:false,
			gravity: { y: 0 }
		}
	},
	parent: 'phaser-game',
	transparent:false
}


export class CandyGame extends Phaser.Game{
	private ws!:WebSocket;
	private BASE_URL = '/client-screen/game';
	private SOCKET_URL = 'ws://' + window.location.hostname + ':3080/?uuid=GAME_SCREEN';

	constructor(config:Phaser.Types.Core.GameConfig){
		super(config);
		if(process.env.NODE_ENV === 'development')
		{
			this.BASE_URL = '';			
		}
		
		let scene = new MainWorldScene({},this.BASE_URL);
		this.scene.add('main_world',scene,true);
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
			
			if(this.scene.isActive('main_world'))
			{
				let scene = this.scene.getScene('main_world') as MainWorldScene;
				scene.processSocketMessage(message);
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

let game = new CandyGame(config)

export default game;
