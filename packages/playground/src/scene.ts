import * as Phaser from "phaser";
import Player from "./lib/Player"

const tigerImg = require('./assets/Happy_Tiger.gif')
const playerAtlas = require('./assets/my-knight.json')
const playerSheetImg = require('./assets/my-knight-0.png')
const particleImg = require('./assets/muzzleflash3.png')
const tileSheetImg = require('./assets/my-sprite-sheet.png')
const spikeImg = require('./assets/spike.png')
const tileMapJson = require('./assets/level1.json')

export default class HelloWorldScene extends Phaser.Scene
{
	private environment = 'develop';
	private MAX_PLAYERS = 8;
	private cursors!:any;
	private player:Player[];
	private ws!:WebSocket;
	private map!:Phaser.Tilemaps.Tilemap;
	private layer:any = null;
	private safetile = 14;
	private dots:any = null;
	private walkAnim!:any;
	constructor()
	{
		super('OurGame');
		this.player = [];	
		console.log(process.env.NODE_ENV);
	}

	private addPlayer(id:string)
	{
		if(this.player.length >= this.MAX_PLAYERS) return;

		let player = new Player(id);
		player.sprite = this.add.sprite(50,200,'player');
		player.sprite.play("walk");
		this.player.push(player);
	}

	private playerMove(id:string,heading:string)
	{
		let player = this.getPlayerById(id);
		if(player) {
			player.move(heading);
		}
	}

	private playerStop(id:string)
	{
		let player = this.getPlayerById(id);
		if(player) {
			player.stop();
		}
	}

	private playerDestroy(id:string)
	{
		let player = this.getPlayerById(id);
		let index = this.getPlayerIndexById(id);
		if(player) {
			player.destroy();			
		}

		if(index){
			this.player.splice(index,1)
		}
	}

	private getPlayerById(id:string):Player|null
	{
		let player = null;
		this.player.forEach((p:Player)=> {									
			if(p.id === id){
				player = p;
				return;
			}
		})

		return player;
	}

	private getPlayerIndexById(id:string):number|null
	{
		let index = null;
		this.player.forEach((player:Player,i:number)=> {									
			if(player.id === id){
				index = i;
				return;
			}
		})

		return index;
	}

	private openWebSocket():void{
		if(this.environment === 'DEVELOP')
		{
			this.ws = new WebSocket('ws://localhost:3080/?uuid=GAME_SCREEN');
		}else{
			this.ws = new WebSocket('ws://neverland.scherzer.com.au:3080/?uuid=GAME_SCREEN');
		}

		this.ws.onopen = () => {
			console.log('Scene connected to socket server.')
		}

		this.ws.onmessage = (evt:any) => {			
			const message = evt.data.toString();
			
			if(!message.startsWith('g|')) return;
			let aData = message.split('|');
			
			/* TODO: Fix this. Invalid messages will crash the server. */
			switch(aData[1])
			{
				case 'j':
					this.addPlayer(aData[2]);
					break;
				case 'n':
					this.playerMove(aData[2],aData[1]);
					break;
				case 'ne':
					this.playerMove(aData[2],aData[1]);
					break;					
				case 'e':
					this.playerMove(aData[2],aData[1]);
					break;
				case 'se':
					this.playerMove(aData[2],aData[1]);
					break;
				case 's':
					this.playerMove(aData[2],aData[1]);
					break;
				case 'sw':
					this.playerMove(aData[2],aData[1]);
					break;					
				case 'w':
					this.playerMove(aData[2],aData[1]);
					break;
				case 'nw':
					this.playerMove(aData[2],aData[1]);
					break;					
				case 'h':
					this.playerStop(aData[2]);
					break;
				case 'x':
					this.playerDestroy(aData[2]);
					break;
			}
		}		
	}

	preload() {		
		if(this.environment !== 'DEVELOP')
		{
			this.load.setBaseURL('/client-screen/game');
		}
		this.load.tilemapTiledJSON('map', tileMapJson);
		this.load.image('tiles',tileSheetImg);
		this.load.image('spike',spikeImg);
		this.load.atlas('player',playerSheetImg,playerAtlas);
	
		this.load.image("tiger", tigerImg);
		this.load.image("red", particleImg);
		
		this.openWebSocket();	
	}

	create() {
		/* Listen to cursor key events (arrow keys) */
		this.cursors = this.input.keyboard.createCursorKeys();
		
		/* Load tiles from a tile map. */
		this.map = this.make.tilemap({ key: 'map' });
		const tileset = this.map.addTilesetImage('my_simple_game','tiles');		
		const groundLayer = this.map.createStaticLayer('MyGround', tileset, 0, 0);
		
		/* Add player texture atlas. */
		
		// this.player = this.physics.add.sprite(50, 300, 'player');
		
		/* Attach animation to player. */
		this.walkAnim = this.anims.create({
			key: "walk",
			frameRate: 7,
			frames: this.anims.generateFrameNames("player", {
				prefix: "Walk_",
				suffix: ".png",
				start: 1,
				end: 10,
				zeroPad: 1
			}),
			repeat: -1
		});
		
		
		
		
		// Hello World
		//const logo = this.add.image(400, 150, "tiger");
		//var particles = this.add.particles('red');	  
		//var emitter = particles.createEmitter({
	//		  speed: 100,
	//		  scale: { start: 1, end: 0 },
	//		  blendMode: 'ADD'
	//	});
		// emitter.startFollow(this.player[0].sprite,-100);
	  
	  
	//	this.tweens.add({
	//	  targets: logo,
//		  y: 450,
//		  duration: 2000,
//		  ease: "Power2",
//		  yoyo: true,
//		  loop: -1
//		});
	  }

	update(){		
		for(var i=0;i<this.player.length;i++)
		{
			this.player[i].update();			
		}
	}
}