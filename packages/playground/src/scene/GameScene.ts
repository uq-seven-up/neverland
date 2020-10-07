import * as Phaser from "phaser";
import AbstractScene from "./AbstractScene"
import {AssetItem} from "./AbstractScene"
import CandyGame from "../CandyGame";
import Player from "../lib/Player"


const ASSET:Map<string,AssetItem> = new Map();
ASSET.set('cookie',{type:'image',src:require('../assets/cookie.png')});
ASSET.set('donut',{type:'image',src:require('../assets/donut.png')});
ASSET.set('icecream',{type:'image',src:require('../assets/icecream.png')});
ASSET.set('lolly',{type:'image',src:require('../assets/lolly.png')});
ASSET.set('muffin',{type:'image',src:require('../assets/muffin.png')});
ASSET.set('swirl',{type:'image',src:require('../assets/swirl.png')});
ASSET.set('puck',{type:'image',src:require('../assets/puck.png')});
ASSET.set('particle',{type:'image',src:require('../assets/muzzleflash3.png')});
ASSET.set('tiles',{type:'image',src:require('../assets/tiles.png')});
ASSET.set('knight',{type:'image',src:require('../assets/my-knight-0.png')});
ASSET.set('player',{type:'atlas',src:require('../assets/my-knight.json'),ref:'knight'});
ASSET.set('map',{type:'map',src:require('../assets/level2.json')});


export default class GameScene extends AbstractScene  
{
	private static LOCAL_PLAYER_ID = 'local_player';
	private static ROUND_TIME = 120;
	
	private cursors!:any;
	private player:Player[];
	private scoreText:Phaser.GameObjects.Text[];
	private obstacle:Phaser.Physics.Arcade.Sprite[];
	private boom!:any;
	private map!:Phaser.Tilemaps.Tilemap;
	private layer:any = null;
	private safetile = 14;
	private dots:any = null;
	private walkAnim!:any;
	private candyGroup!:Phaser.Physics.Arcade.Group;
	private timeEvent!:Phaser.Time.TimerEvent;
	private clockText!:Phaser.GameObjects.Text;
	private teamScore:number[];
	
	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config,baseUrl);
		
		this.player = [];	
		this.obstacle = [];
		this.scoreText = [];
		this.teamScore = [0,0];		
	}

	private addPlayer(id:string)
	{
		if(this.getPlayerById(id)) return;
		
		let player = new Player(id,this);
		player.sprite.x = player.sprite.x + (player.sprite.width * this.player.length);
		player.team = (this.player.length + 2) % 2;
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

	public processSocketMessage(message:string)
	{
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

/**
 * Phaser life cycle method. (This method is called by the Scene Manager, after init() and before create())
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback
 */
	public preload() {		
		this.assetLoader(ASSET);
	}


/**
 * Phaser life cycle method. (This method is called by the Scene Manager when the scene starts, after init() and preload())
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
 */
	public create() {
		this.player = [];	
		this.obstacle = [];
		this.scoreText = [];
		this.teamScore = [0,0];	

		/* Listen to cursor key events (arrow keys) */
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.physics.world.setBoundsCollision(true,true,true,true);

		/* Load tiles from a tile map. */
		this.map = this.make.tilemap({ key: 'map' });
		const tileset = this.map.addTilesetImage('my_simple_game','tiles');		
		this.map.createStaticLayer('ground', tileset, 0, 0);
		
		//this.map.findTile
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
			this.addPlayer(GameScene.LOCAL_PLAYER_ID);
		}) 
		
		var r_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
		r_key.on('down',(e:Phaser.Input.Keyboard.Key) => {
			this.scene.restart();
		},this);
		 
		this.cursors = this.input.keyboard.createCursorKeys();
		this.sendEventToAllPlayers(90);
		
		this.clockText = this.add.text(1280, 10, '00:00:00', {fontSize: '60px', fill: '#000'});

		this.timeEvent = this.time.addEvent({delay:1000, 
											 repeat:GameScene.ROUND_TIME,
											 callback:this.checkEndOfGame,
											 callbackScope:this});

		let that = this;
		this.cameras.main.on('camerafadeoutcomplete', function () {
			that.scene.start('end_scene',{teamScore:that.teamScore});
			}, this);												
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
		//this.ws.send('b|v||90');
		this.cameras.main.fadeIn(1000, 0, 0, 0)
	  }

	  private endGame()
	  {
		this.cameras.main.fadeOut(5000, 0, 0, 0);
	  }

	  private checkEndOfGame()
	  {
		if(this.timeEvent.repeatCount === 6){
			this.endGame()
		} 
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
			this.teamScore[player.team] =+ player.score;


			this.scoreText[0].text = 'Team 1: ' + this.teamScore[0];
			this.scoreText[1].text = 'Team 2: ' + this.teamScore[1];
			candyObj.destroy();	
		
			(this.game as CandyGame).sendEventToPlayer(player.id,200);
		}				
	}

	private updateLocalPlayer(){
		let player = this.getPlayerById(GameScene.LOCAL_PLAYER_ID);
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

	/**
	 * Phaser life cycle method. (This method is called once per game step while the scene is running.)
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
	 */
	public update(){		
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

		this.clockText.setText(this.timeEvent.repeatCount.toString())
	}
}