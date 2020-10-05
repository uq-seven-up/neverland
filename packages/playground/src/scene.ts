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
const puckImg = require('./assets/puck.png')

const tileMapJson = require('./assets/level2.json')

export default class MainWorldScene extends Phaser.Scene  
{
	private static LOCAL_PLAYER_ID = 'local_player';
	private BASE_URL = '/client-screen/game';
	private SOCKET_URL = 'ws://' + window.location.hostname + ':3080/?uuid=GAME_SCREEN';
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
		if(process.env.NODE_ENV === 'development')
		{
			this.BASE_URL = '';			
		}
		console.log(process.env.NODE_ENV,this.BASE_URL,this.SOCKET_URL);
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
		this.ws = new WebSocket(this.SOCKET_URL);
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
		this.load.setBaseURL(this.BASE_URL);
		
		this.load.tilemapTiledJSON('map', tileMapJson);
		this.load.image('tiles',tilesImg);
		this.load.image('cookie',cookieImg);
		this.load.image('donut',donutImg);
		this.load.image('icecream',icecreamImg);
		this.load.image('lolly',lollyImg);
		this.load.image('muffin',muffinImg);
		this.load.image('swirl',swirlImg);
		this.load.image('puck',puckImg);

		

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
		this.map.createStaticLayer('ground', tileset, 0, 0);
		
		this.map.findTile

		this.obstacle.push(this.physics.add.sprite(250,90,'puck'));
		this.obstacle[0].setCollideWorldBounds(true);
		this.obstacle[0].setBounce(0.7,0.7);
		this.obstacle[0].body.isCircle = true;

		this.obstacle.push(this.physics.add.sprite(700,100,'puck'));
		this.obstacle[1].setCollideWorldBounds(true);
		this.obstacle[1].setBounce(0.7,0.7);
		this.obstacle[1].body.isCircle = true;
		
		this.obstacle.push(this.physics.add.sprite(850,90,'puck'));
		this.obstacle[2].setCollideWorldBounds(true);
		this.obstacle[2].setBounce(0.7,0.7);
		this.obstacle[2].body.isCircle = true;
		
		this.obstacle.push(this.physics.add.sprite(500,90,'puck'));
		this.obstacle[3].setCollideWorldBounds(true);
		this.obstacle[3].setBounce(0.7,0.7);
		this.obstacle[3].body.isCircle = true;

		this.obstacle.push(this.physics.add.sprite(850,590,'puck'));
		this.obstacle[4].setCollideWorldBounds(true);
		this.obstacle[4].setBounce(0.1,0.1);
		this.obstacle[4].body.isCircle = true;

		this.obstacle.push(this.physics.add.sprite(350,190,'puck'));
		this.obstacle[5].setCollideWorldBounds(true);
		this.obstacle[5].setBounce(0.1,0.1);
		this.obstacle[5].body.isCircle = true;


		this.physics.world.on('tileoverlap', () => {console.log('listener')});

		this.candyGroup = this.physics.add.group({
			allowGravity: false,
			immovable: true
		  });

		const candyObjects = this.map.getObjectLayer('candy')['objects'];
		candyObjects.forEach(candyObject => {
			this.candyGroup.create(candyObject.x!, candyObject.y! - candyObject.height!,candyObject.type).setOrigin(0,0);
		  });

		this.scoreText[0] = this.add.text(10, 10, 'Team 1: 0', {fontSize: '20px', fill: '#000'});
		this.scoreText[1] = this.add.text(10, 40, 'Team 2: 0', {fontSize: '20px', fill: '#000'});
		
		
		var p_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
		p_key.on('down',(e:Phaser.Input.Keyboard.Key) => {
			this.addPlayer(MainWorldScene.LOCAL_PLAYER_ID);
		})  
		this.cursors = this.input.keyboard.createCursorKeys();
			// W key down
	   
	   
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
		this.ws.send('b|v||90');
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
			if (this.ws.readyState === WebSocket.OPEN) {
				this.ws.send(`c|v|${player.id}|200|`);
			}
		}				
	}

	private updateLocalPlayer(){
		let player = this.getPlayerById(MainWorldScene.LOCAL_PLAYER_ID);
		if(player === null) return;
		if (this.cursors.up.isDown){player.move('n'); return;}
		if (this.cursors.right.isDown){player.move('e');return;}
		if (this.cursors.down.isDown){player.move('s');return;}
		if (this.cursors.left.isDown){player.move('w');return;}
		//player.stop();
		
	}

	private adjustSpeedForTile(player:Player){
		let tile = this.map.getTileAtWorldXY(player.sprite.x,player.sprite.y);
		switch(tile.index)
		{
			case 1:
				player.speed = 150;
				break;
			case 2:
				player.speed = 300;
				break;	
			default:
				player.speed = 50;
		}
	}

	update(){		
		for(var i=0;i<this.player.length;i++)
		{
			this.adjustSpeedForTile(this.player[i]);
			this.player[i].update();
			for(var j=0;j<this.player.length;j++){
				if(j === i) continue;
				this.physics.collide(this.player[i].sprite,this.player[j].sprite,() => {console.log('two players collided')});
			}
			this.physics.collide(this.player[i].sprite,this.obstacle,() => {console.log('player collided')});
			this.physics.collide(this.obstacle,this.obstacle,() => {console.log('obstacles collided')});
			this.physics.collide(this.obstacle,this.candyGroup,() => {console.log('obstacles with candy')});
			this.physics.overlap(this.player[i].sprite,this.candyGroup,this.handlePlayerOverlapsCandy,undefined,this);			
		}		
		
		this.updateLocalPlayer()
	}
}