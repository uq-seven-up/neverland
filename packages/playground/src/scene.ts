import * as Phaser from "phaser";
import Player from "./lib/Player"

const playerAtlas = require('./assets/my-knight.json')
const playerSheetImg = require('./assets/my-knight-0.png')
const particleImg = require('./assets/muzzleflash3.png')

const cookieImg = require('./assets/cookie.png')
const donutImg = require('./assets/donut.png')
const icecreamImg = require('./assets/icecream.png')
const lollyImg = require('./assets/lolly.png')
const muffinImg = require('./assets/muffin.png')
const swirlImg = require('./assets/swirl.png')
const tilesImg = require('./assets/tiles.png')

const tileMapJson = require('./assets/level2.json')

export default class HelloWorldScene extends Phaser.Scene
{
	private MAX_PLAYERS = 8;
	private cursors!:any;
	private player:Player[];
	private scoreText:Phaser.GameObjects.Text[];
	private obstacle:Phaser.Physics.Arcade.Sprite[];
	private boom!:any;
	private ws!:WebSocket;
	private map!:Phaser.Tilemaps.Tilemap;
	private layer:any = null;
	private safetile = 14;
	private dots:any = null;
	private walkAnim!:any;
	private candyGroup!:Phaser.Physics.Arcade.Group;
	constructor()
	{
		super({key:'MyScene',active:true});
		this.player = [];	
		this.obstacle = [];
		this.scoreText = [];
		console.log(process.env.NODE_ENV);
	}

	private addPlayer(id:string)
	{
		if(this.player.length >= this.MAX_PLAYERS) return;

		let player = new Player(id,this);
		this.player.push(player);		
	}

	private collissionDetected(src:any,trg:any)
	{
		console.log("boom");
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

	private getPlayerById = (id:string):Player|null =>
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
		this.ws = new WebSocket('ws://localhost:3080/?uuid=GAME_SCREEN');
		// this.ws = new WebSocket('ws://neverland.scherzer.com.au:3080/?uuid=GAME_SCREEN');
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
		// this.load.setBaseURL('/client-screen/game');
		this.load.tilemapTiledJSON('map', tileMapJson);
		this.load.image('tiles',tilesImg);
		this.load.image('cookie',cookieImg);
		this.load.image('donut',donutImg);
		this.load.image('icecream',icecreamImg);
		this.load.image('lolly',lollyImg);
		this.load.image('muffin',muffinImg);
		this.load.image('swirl',swirlImg);

		this.load.atlas('player',playerSheetImg,playerAtlas);			
		this.load.image("red", particleImg);

		this.openWebSocket();	
	}

	create() {
		/* Listen to cursor key events (arrow keys) */
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.physics.world.setBoundsCollision(true,true,true,true);

		/* Load tiles from a tile map. */
		this.map = this.make.tilemap({ key: 'map' });
		const tileset = this.map.addTilesetImage('my_simple_game','tiles');		
		const groundLayer = this.map.createStaticLayer('ground', tileset, 0, 0);
		
		this.obstacle.push(this.physics.add.sprite(250,90,'donut'));
		this.obstacle[0].setCollideWorldBounds(true);
		this.obstacle[0].setBounce(0.3,0.3);
		this.obstacle[0].body.isCircle = true;

		this.obstacle.push(this.physics.add.sprite(700,100,'donut'));
		this.obstacle[1].setCollideWorldBounds(true);
		this.obstacle[1].setBounce(0.3,0.3);
		this.obstacle[1].body.isCircle = true;
		
		this.obstacle.push(this.physics.add.sprite(850,90,'donut'));
		this.obstacle[2].setCollideWorldBounds(true);
		this.obstacle[2].setBounce(0.3,0.3);
		this.obstacle[2].body.isCircle = true;
		
		this.physics.world.on('tileoverlap', () => {console.log('listener')});

		this.candyGroup = this.physics.add.group({
			allowGravity: false,
			immovable: true
		  });

		const candyObjects = this.map.getObjectLayer('candy')['objects'];
		candyObjects.forEach(candyObject => {
			const candy = this.candyGroup.create(candyObject.x!, candyObject.y! - candyObject.height!,candyObject.type).setOrigin(0,0);
		  });

		  this.scoreText[0] = this.add.text(10, 10, 'Team 1: 0', {fontSize: '20px', fill: '#000'});
		  this.scoreText[1] = this.add.text(10, 40, 'Team 2: 0', {fontSize: '20px', fill: '#000'});
		
		
		
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

	private handlePlayerOverlapsCandy(playerObj:Phaser.Types.Physics.Arcade.GameObjectWithBody,candyObj:Phaser.Types.Physics.Arcade.GameObjectWithBody){
		let player = this.getPlayerById(playerObj.name);
		if(player)
		{
			let points = 0
			let candySprite = candyObj as Phaser.Physics.Arcade.Sprite;
			
			switch(candySprite.texture.key)
			{
				case 'cookie':
					points = 25
					break
				case 'donut':
					points = 50
					break
				case 'icecream':
					points = 50
					break
				case 'lolly':
					points = 10
					break
				case 'muffin':
					points = 5
					break 
				case 'swirl':
					points = 10
					break;
			}
			
			player.score += points;
			
			this.scoreText[0].text = 'Team 1: ' + player.score;
			candyObj.destroy();	
		}				
	}

	update(){		
		for(var i=0;i<this.player.length;i++)
		{
			this.player[i].update();
			this.physics.collide(this.player[i].sprite,this.obstacle,() => {console.log('player collided')});
			this.physics.collide(this.obstacle,this.obstacle,() => {console.log('obstacles collided')});
			this.physics.collide(this.obstacle,this.candyGroup,() => {console.log('obstacles with candy')});
			this.physics.overlap(this.player[i].sprite,this.candyGroup,this.handlePlayerOverlapsCandy,undefined,this);			
		}						
	}
}