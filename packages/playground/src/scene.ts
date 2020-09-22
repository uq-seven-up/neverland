import * as Phaser from "phaser";

const tigerImg = require('./assets/Happy_Tiger.gif')
const playerAtlas = require('./assets/my-knight.json')
const playerSheetImg = require('./assets/my-knight-0.png')
const particleImg = require('./assets/muzzleflash3.png')
const tileSheetImg = require('./assets/my-sprite-sheet.png')
const spikeImg = require('./assets/spike.png')
const tileMapJson = require('./assets/level1.json')


export default class HelloWorldScene extends Phaser.Scene
{
	private cursors!:any;
	private player!:Phaser.GameObjects.Sprite;
	private ws!:WebSocket;
	private move_x = 0;
	private move_y = 0;
	private map!:Phaser.Tilemaps.Tilemap;
	private layer:any = null;
	private safetile = 14;
	private dots:any = null;
	private walkAnim!:any;
	constructor()
	{
		super('OurGame')	
	}

	private openWebSocket():void{
		this.ws = new WebSocket('ws://localhost:3080');
		this.ws.onopen = () => {
			console.log('Scene connected to socket server.')
		}

		this.ws.onmessage = (evt:any) => {
			// listen to data sent from the websocket server
			const data = JSON.parse(evt.data)
			this.move_x = this.move_x === 0 ? 1 : 0;
			console.log(data);
		}
	}

	preload() {		
		// this.load.setBaseURL('/client-screen/game');

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
		this.player = this.add.sprite(50,200,'player');
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
		
		this.player.play("walk");
		
		
		// Hello World
		const logo = this.add.image(400, 150, "tiger");
		var particles = this.add.particles('red');	  
		var emitter = particles.createEmitter({
			  speed: 100,
			  scale: { start: 1, end: 0 },
			  blendMode: 'ADD'
		});
		emitter.startFollow(this.player,-100);
	  
	  
		this.tweens.add({
		  targets: logo,
		  y: 450,
		  duration: 2000,
		  ease: "Power2",
		  yoyo: true,
		  loop: -1
		});
	  }

	update(){
		if (this.cursors.left.isDown) {
			this.move_x = -2;
		  } else if (this.cursors.right.isDown) {
			this.move_x = 2;
		  } else if (this.cursors.up.isDown) {
			this.move_y = -2;
		  } else if (this.cursors.down.isDown) {
			this.move_y = 2;
		  } else {
			this.move_x = 0;
			this.move_y = 0;
		  }

		this.player.x += this.move_x;
		this.player.y += this.move_y;		
	}
}