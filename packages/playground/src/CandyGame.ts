import * as Phaser from "phaser";

import EndScene from "./scene/EndScene";
import GameScene from "./scene/GameScene";
import IntroScene from "./scene/IntroScene";

/**
 * The main controller for the entire game. 
 * Manages scenes and networking code.
 * 
 * https://photonstorm.github.io/phaser3-docs/Phaser.Game.html
 */
export default class CandyGame extends Phaser.Game{
	/** URL prefix used when loading game assets.*/
	private BASE_URL = '/client-screen/game';
	
	/** URL of the game server. 
	To simplify testing it is required that the game_client and game_server have the
	same hostname.)*/
	private SOCKET_URL = 'ws://' + window.location.hostname + ':3080/?uuid=GAME_SCREEN';
	
	/** Reference to the web socket connection to the game server.*/
	private ws!:WebSocket;

	constructor(config:Phaser.Types.Core.GameConfig){
		super(config);
	
		/* During development (prior to integrating into the client screen, 
			the base URL is the root of the project.*/
		if(process.env.NODE_ENV === 'development')
		{
			this.BASE_URL = '';			
		}
		
		/* Instantiate all game scenes.*/
		let introScene = new IntroScene({},this.BASE_URL);
		this.scene.add('intro_scene',introScene,false);
		
		let gameScene = new GameScene({},this.BASE_URL);
		this.scene.add('game_scene',gameScene,true);

		let endScene = new EndScene({},this.BASE_URL);
		this.scene.add('end_scene',endScene,false);
	}

	/**
	 * Phaser life cycle method. (This method is called automatically when the DOM is ready.)
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Game.html#boot__anchor
	 */
	public boot()
	{
		super.boot();
		this.connect();
	}

	/**
	 * Connect to the web socket server and configure web socket
	 * event handlers.
	 */
	private connect = () => {
		this.ws = new WebSocket(this.SOCKET_URL);
		
		/* Action to take when the connection to the game server has been established. */
		this.ws.onopen = () => {
			console.log('Game connected to socket server.')
		}

		/* Action to take when a message is received from the game server. */
		this.ws.onmessage = (evt:any) => {			
			const message = evt.data.toString();
			if(!message.startsWith('g|')) return;/* Disregard any message that is not specifically addressed to the game. */
			
			/* If the game is being played route all messages to the game scene for processing. */
			if(this.scene.isActive('game_scene'))
			{
				let scene = this.scene.getScene('game_scene') as GameScene;
				scene.processSocketMessage(message);
			}

			/* If the intro scene is active, start the game as soon as any game message is received. */
			if(this.scene.isActive('intro_scene'))
			{
				let scene = this.scene.getScene('intro_scene') as IntroScene;
				scene.startGame();
			}
		}

		/* If the game screen is disconnected from the server, attempt to reconnect every n seconds.*/
		this.ws.onclose = () => {
			let that = this;
			console.log('Screen disconnected, retry reconnect in two seconds.')	
			setTimeout(function() {
			that.connect();
			}, 2000);		
		}
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
	public sendEventToPlayer(playerId:string,eventId:number)
	{
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(`c|v|${playerId}|${eventId}|`);
		}
	}

	/**
	 * Convenience method for broadcasting a game event to all players.
	 * 
	 * For an overview of event types see the comments in.
	 * packages/server/src/lib/GameServer.ts
	 * 
	 * @param eventId The event id which is send to the players client.
	 */	
	public sendEventToAllPlayers(eventId:number)
	{
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(`b|v||${eventId}|`);
		}
	}
}