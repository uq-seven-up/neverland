import * as Phaser from "phaser";
import AbstractScene from "./AbstractScene"
import {AssetItem} from "./AbstractScene"
import {EndSceneConfig} from "./EndScene"
import CandyGame from "../CandyGame";
import Player from "../lib/Player"

/* Define assets which need to be loaded for this scene. */
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

/**
 * Manages the scene in which player play the game play.
 */
export default class GameScene extends AbstractScene  
{
	/** The duration of a single game in seconds. */
	private static ROUND_TIME = 9;
	
	/** The id used by the player using the keyboard connected to the game screen. (debug player) */
	private static LOCAL_PLAYER_ID = 'local_player';
	
	/** Reference to the keyboard cursor keys for controlling the local player. (debug player) */
	private cursors!:any;
	
	/** Track all players which are playing the game. (in the scene) */
	private player:Player[];
	
	/** The tile map being played on. */
	private map!:Phaser.Tilemaps.Tilemap;
	
	/** Text object for displaying team scores. */
	private scoreText:Phaser.GameObjects.Text[];
	
	/** Text object for displaying the remaining game time. */
	private clockText!:Phaser.GameObjects.Text;
	
	/** Pucks that can be pushed around the map. */
	private obstacle:Phaser.Physics.Arcade.Sprite[];
	
	/** Candy that can be collected by players.*/
	private candyGroup!:Phaser.Physics.Arcade.Group;
	
	/** Timer Object for counting down remaining game time. */
	private timeEvent!:Phaser.Time.TimerEvent;
	
	/** The score for each team. Team 1 = 0, Team 2 = 1. */
	private teamScore:number[];
	
	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config,baseUrl);
		
		this.player = [];	
		this.obstacle = [];
		this.scoreText = [];
		this.teamScore = [0,0];		
	}

	/**
	 * Phaser life cycle method. (This method is called by the Scene Manager, after init() and before create())
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback
	 */
	public preload() {		
		/* Load all game assets. (images, image atlases, tile maps) */
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
			let config:EndSceneConfig = {
				teamScore:that.teamScore
			};

			that.scene.start('end_scene',config);
		}, this);												
		
	   
		//var particles = this.add.particles('red');	  
		//var emitter = particles.createEmitter({
	//		  speed: 100,
	//		  scale: { start: 1, end: 0 },
	//		  blendMode: 'ADD'
	//	});
		// emitter.startFollow(this.player[0].sprite,-100);
	  
		//this.sendEventToAllPlayers(90);
		
		this.cameras.main.fadeIn(1000, 0, 0, 0)
	  }



	/**
	 * Phaser life cycle method. (This method is called once per game step while the scene is running.)
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
	 */
	public update(){		

		/* Manage world interaction for each player currently in the game.*/
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
		
		/* Manage the local player. (Debug Player) */
		this.updateLocalPlayer()

		/* Update the current remaining game time.*/
		this.clockText.setText(this.timeEvent.repeatCount.toString())
	}

	/**
	 * Add a new player into the scene. (places a player on the map)
	 * @param id The id used to track this player. (This is usually the UUID that is sent by the mobile
	 * 			 client when connecting to the server.)
	 */
	private addPlayer(id:string)
	{
		if(this.getPlayerById(id)) return;/* prevent adding a player into the game more than once. */
		

		let player = new Player(id,this);
		/* Give each player a different start position, to prevent players overlapping on game start. */
		player.sprite.x = player.sprite.x + (player.sprite.width * this.player.length);
		player.team = (this.player.length + 2) % 2;
		
		/* Start tracking this player in the game. */
		this.player.push(player);	
	}

	/**
	 * Moves the player character towards the specified heading.
	 * @param id The id used to track a player.
	 * @param heading Compass directions.(n,ne,e,se,s,sw,w,nw)
	 */
	private playerMove(id:string,heading:string)
	{
		let player = this.getPlayerById(id);
		if(player) {
			player.move(heading);
		}
	}

	/**
	 * Makes the player character stationary.
	 * @param id The id used to track a player.
	 */
	private playerStop(id:string)
	{
		let player = this.getPlayerById(id);
		if(player) {
			player.stop();
		}
	}

	/**
	 * Takes the player out of the game, and removes the player character from the map.
	 * This method does NOT disconnect the player from the game.
	 * @param id The id used to track a player.
	 */
	private playerDestroy(id:string)
	{
		let index = this.getPlayerIndexById(id);
		let player = this.getPlayerById(id);
		
		/* Stop tracking the player in the game. */
		if(index){
			this.player.splice(index,1)
		}
		
		/* Removes the player character assets from the scene.*/
		if(player) {
			player.destroy();			
		}
	}

	/**
	 * Gets a reference to the playe object based on a player id.
	 * If the id is not associated with a player the method returns: null.
	 * @param id The id used to track a player.
	 */
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

	/**
	 * Gets the index position of player object based on a player id.
	 * If the id is not associated with a player the method returns: null.
	 * @param id The id used to track a player.
	 */
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

	/**
	 * Adjust the player movement speed based on the type of tile they are standing on.
	 * @param player The player who's movement speed will be adjusted.
	 */
	private adjustSpeedForTile(player:Player){
		/* Determine the tile that the player is currently standing on. */
		let tile = this.map.getTileAtWorldXY(player.sprite.x,player.sprite.y);
		
		/* Adjust speed based on the tile index. (index position is determined by arrangement of tiles on the sprite sheet.) */
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
	 * Handle what happens when a players run into candy on the game board.
	 * ie. Picking up candy.
	 * @param playerObj The player sprite used for collision detection.
	 * @param candyObj The candy group against which collisions are detected.
	 */
	private handlePlayerOverlapsCandy(playerObj:Phaser.Types.Physics.Arcade.GameObjectWithBody,candyObj:Phaser.Types.Physics.Arcade.GameObjectWithBody){
		let player = this.getPlayerById(playerObj.name);
		if(player)
		{
			/* Determine the amount of points to award based on the type of candy the player collided with. */
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
			
			/* Update the players and the teams score. */
			player.score += points;
			this.teamScore[player.team] =+ player.score;
  
			/* Update the game score board text. */
			this.scoreText[0].text = 'Team 1: ' + this.teamScore[0];
			this.scoreText[1].text = 'Team 2: ' + this.teamScore[1];
			
			/* Remove the candy from the game board. */
			candyObj.destroy();	
		
			/* Send a "candy collected" event to the mobile client of the player that just collected candy. */
			(this.game as CandyGame).sendEventToPlayer(player.id,200);
		}
	}
  
	/**
	 * Allow moving the local player (debug player) using the keyboard cursor keys.
	 */
	private updateLocalPlayer(){
		let player = this.getPlayerById(GameScene.LOCAL_PLAYER_ID);
		if(player === null) return;
	
		if (this.cursors.up.isDown){player.move('n'); return;}
		if (this.cursors.right.isDown){player.move('e');return;}
		if (this.cursors.down.isDown){player.move('s');return;}
		if (this.cursors.left.isDown){player.move('w');return;}
		//player.stop();	
	}

	/**
	 * Processes incoming game messages sent by the game server.
	 * 
	 * This includes movement commands initiated by the mobile client,
	 * as well as game commands sent by the server.
	 * 
	 * @param message 
	 */
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
	 * Check for the end of game condition.
	 */
	private checkEndOfGame()
	{
		/* Currently the game signals the immenent game end by starting to slowly fade out the game with n seconds to go.*/
		if(this.timeEvent.repeatCount === 6){
			this.endGame()
		}
	}

	/**
	 * Ends the currently running game.
	 */
	private endGame()
	{
		/* 
		The game is over once the scene is faded out which fires the fade out event listeners attached to the camera. 
		See the create() method. */
		this.cameras.main.fadeOut(5000, 0, 0, 0);
	}
}