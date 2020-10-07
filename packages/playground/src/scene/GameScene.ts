import * as Phaser from "phaser";
import AbstractScene from "./AbstractScene"
import {AssetItem} from "./AbstractScene"
import {EndSceneConfig} from "./EndScene"
import CandyGame from "../CandyGame";
import Player from "../lib/Player"
import { Bounds } from "matter";

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
ASSET.set('rain',{type:'image',src:require('../assets/rain.png')});
ASSET.set('tiles',{type:'image',src:require('../assets/tiles.png')});
ASSET.set('knight',{type:'image',src:require('../assets/my-knight-0.png')});
ASSET.set('player',{type:'atlas',src:require('../assets/my-knight.json'),ref:'knight'});
ASSET.set('map',{type:'map',src:require('../assets/level2.json')});

/**
 * Manages the scene in which the game is played.
 */
export default class GameScene extends AbstractScene  
{
	/** The duration of a single game in seconds. */
	private static ROUND_TIME = 120;
	
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
	private puck:Phaser.Physics.Arcade.Sprite[];
	
	/** Candy that can be collected by players.*/
	private candyGroup!:Phaser.Physics.Arcade.Group;
	
	/** Timer Object for counting down remaining game time. */
	private timeEvent!:Phaser.Time.TimerEvent;

	/** Adds rain particles to the scene. */
	private rainEmitter!:Phaser.GameObjects.Particles.ParticleEmitter;
	
	/** The score for each team. Team 1 = 0, Team 2 = 1. */
	private teamScore:number[];
	
	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config,baseUrl);
		
		this.player = [];	
		this.puck = [];
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
		/* Ensure game properties are reset when the scene is restarted (for the next new game). */
		this.player = [];	
		this.puck = [];
		this.scoreText = [];
		this.teamScore = [0,0];	

		/* Pressing "1" on the keyboard places the local player into the game. (debug player.) */
		var one_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
		one_key.on('down',(e:Phaser.Input.Keyboard.Key) => {
			this.addPlayer(GameScene.LOCAL_PLAYER_ID);
		}) 
		
		/* Listen to cursor key events (for controlling the local player with arrow keys) */
		this.cursors = this.input.keyboard.createCursorKeys();

		/* Prevent objects from leaving the map. */
		this.physics.world.setBoundsCollision(true,true,true,true);

		/* Render the game map created with tiled. (the tile map). */
		this.map = this.make.tilemap({key:'map'});
		const tileset = this.map.addTilesetImage('my_simple_game','tiles');		
		this.map.createStaticLayer('ground', tileset, 0, 0);
		
		/* Render the candy layer in the game world. */
		this.candyGroup = this.physics.add.group({
			allowGravity: false,
			immovable: true
		  });

		const candyObjects = this.map.getObjectLayer('candy')['objects'];
		candyObjects.forEach(candyObject => {
			this.candyGroup.create(candyObject.x!, candyObject.y! - candyObject.height!,candyObject.type).setOrigin(0,0);
		  });

		/* Place pucks onto the game board. */
		this.addPuck(250,90);
		this.addPuck(700,100);
		this.addPuck(850,90);
		
		/* Position the text for displaying the team score and remaining game time.*/
		this.scoreText[0] = this.add.text(10, 10, 'Team 1: 0', {fontSize: '20px', fill: '#000'});
		this.scoreText[1] = this.add.text(10, 40, 'Team 2: 0', {fontSize: '20px', fill: '#000'});
		this.clockText = this.add.text(1280, 10, GameScene.ROUND_TIME.toString(), {fontSize: '60px', fill: '#000'});
		
		/* Rain effect emitter. */
		var rainParticle = this.add.particles('rain');	  
		this.rainEmitter = rainParticle.createEmitter({
				y: 0,
				x: { min: 0, max: this.game.canvas.width},
				accelerationX:0,
				accelerationY:0,
				gravityY:500,
				lifespan:2200,
				bounce:0.3,
				scaleX:[0.3,0.5],
				scaleY:[0.5,1],
				bounds:{x:0,y:0,w:this.game.canvas.width,h:this.game.canvas.height}
			});
		/* 
			var particles = this.add.particles('red');	  
			var emitter = particles.createEmitter({
				speed: 100,
				scale: { start: 1, end: 0 },
				blendMode: 'ADD'
			});
			emitter.startFollow(this.player[0].sprite,-100);	
		*/

		/* Switch to the end game scene after this scene has faded out. */
		let that = this;
		this.cameras.main.on('camerafadeoutcomplete', function () {
			/* Pass the team score to the end game scene. */
			let config:EndSceneConfig = {
				teamScore:that.teamScore
			};

			that.scene.start('end_scene',config);
		}, this);

		/* Broadcast the start of the game to all players (mobile-clients) */
		this.sendEventToAllPlayers(90);

		this.rain(true);

		/* Start the game countdown. */
		this.timeEvent = this.time.addEvent({delay:1000, 
											repeat:GameScene.ROUND_TIME,
											callback:this.checkEndOfGame,
											callbackScope:this});

		/* Fade in the game scene. */
		this.cameras.main.fadeIn(1000, 0, 0, 0);
	  }

	/**
	 * Phaser life cycle method. (This method is called once per game step while the scene is running.)
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
	 */
	public update(){		

		/* Manage world interaction for each player currently in the game.*/
		for(var i=0;i<this.player.length;i++)
		{
			/* Adjust speed based on tile player is standing on.*/
			this.adjustSpeedForTile(this.player[i]);
			
			/* Test players colliding with each other.*/
			for(var j=0;j<this.player.length;j++){
				if(j === i) continue;
				this.physics.collide(this.player[i].sprite,this.player[j].sprite,() => {return;});/* two players collided */
			}

			/* Player can collide with pucks. (push pucks around) */
			this.physics.collide(this.player[i].sprite,this.puck,() => {return;});/* player collided with puck */
			
			/* Player can collide with candy. (to collect candy) */
			this.physics.overlap(this.player[i].sprite,this.candyGroup,this.handlePlayerOverlapsCandy,undefined,this);			

			/* Update player position on the map. */
			this.player[i].update();
		}		
		
		/* Manage object collisions in the game world.*/
		this.physics.collide(this.puck,this.puck,() => {return;});/* pucks collided */
		this.physics.collide(this.puck,this.candyGroup,() => {return;});/* pucks collided with candy. */
		
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
	 * Place a movable puck onto the map.
	 */
	private addPuck(x:number,y:number)
	{
		this.puck.push(this.physics.add.sprite(x,y,'puck'));
		this.puck[0].setCollideWorldBounds(true);
		this.puck[0].setBounce(0.7,0.7);
		this.puck[0].body.isCircle = true;
	}

	/**
	 * Start and stops raining on the scene.
	 */
	private rain = (makeItRain:boolean) =>
	{
		if(makeItRain)
		{
			this.rainEmitter.start();
		}else
		{
			this.rainEmitter.pause;
		}
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