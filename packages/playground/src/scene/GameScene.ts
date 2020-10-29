import * as Phaser from "phaser";
import AbstractScene from "./AbstractScene"
import {AssetItem} from "./AbstractScene"
import {EndSceneConfig} from "./EndScene"
import CandyGame from "../CandyGame";
import Player from "../lib/Player";
import Puck from "../lib/Puck";
import teamNames from './Teams';

/* Define assets which need to be loaded for this scene. */
const ASSET:Map<string,AssetItem> = new Map();
ASSET.set('cat',{type:'image',src:require('../assets/my_cat.png')});
ASSET.set('cookie',{type:'image',src:require('../assets/cookie.png')});
ASSET.set('dog',{type:'image',src:require('../assets/my_dog.png')});
ASSET.set('donut',{type:'image',src:require('../assets/donut.png')});
ASSET.set('explosionSheet',{type:'image',src:require('../assets/explosion.png')});
ASSET.set('goal',{type:'image',src:require('../assets/goal.png')});
ASSET.set('icecream',{type:'image',src:require('../assets/icecream.png')});
ASSET.set('lolly',{type:'image',src:require('../assets/lolly.png')});
ASSET.set('muffin',{type:'image',src:require('../assets/muffin.png')});
ASSET.set('palm',{type:'image',src:require('../assets/palm.png')});
ASSET.set('puck',{type:'image',src:require('../assets/puck.png')});
ASSET.set('rain',{type:'image',src:require('../assets/rain.png')});
ASSET.set('swirl',{type:'image',src:require('../assets/swirl.png')});
ASSET.set('trail_0',{type:'image',src:require('../assets/trail_0.png')});
ASSET.set('trail_1',{type:'image',src:require('../assets/trail_1.png')});
ASSET.set('trail_2',{type:'image',src:require('../assets/trail_2.png')});
ASSET.set('trail_3',{type:'image',src:require('../assets/trail_3.png')});
ASSET.set('tree',{type:'image',src:require('../assets/tree.png')});
ASSET.set('tiles',{type:'image',src:require('../assets/final tiles.png')});
ASSET.set('spritesheet',{type:'sheet',src:require('../assets/final tiles.png')});
ASSET.set('umbrella1',{type:'image',src:require('../assets/umbrella1.png')});
ASSET.set('umbrella2',{type:'image',src:require('../assets/umbrella2.png')});
ASSET.set('player_cat',{type:'atlas',src:require('../assets/my_cat.json'),ref:'cat'});
ASSET.set('player_dog',{type:'atlas',src:require('../assets/my_dog.json'),ref:'dog'});
ASSET.set('explosion',{type:'atlas',src:require('../assets/explosion.json'),ref:'explosionSheet'});
ASSET.set('level_2',{type:'map',src:require('../assets/level2.json')}); //field
ASSET.set('level_3',{type:'map',src:require('../assets/level3.json')}); //ice
ASSET.set('level_4',{type:'map',src:require('../assets/level4.json')}); //beach
ASSET.set('level_5',{type:'map',src:require('../assets/level5.json')}); //field

declare type coordinate = {
	x:number,
	y:number
}

declare type TeamGoal = coordinate[];

/**
 * Manages the scene in which the game is played.
 */
export default class GameScene extends AbstractScene  
{	
	/** The duration of a single game in seconds. */
	private static ROUND_TIME = 90;
	
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
	private puck:Puck[];
	private puckSprite:Phaser.Physics.Arcade.Sprite[];
	
	/** Candy that can be collected by players.*/
	private candyGroup!:Phaser.Physics.Arcade.Group;

	/** Obstacles that players must walk around.*/
	private obstacleGroup!:Phaser.Physics.Arcade.Group;
	
	/** Timer Object for counting down remaining game time. */
	private timeEvent!:Phaser.Time.TimerEvent;

	/** Adds rain particles to the scene. */
	private rainEmitter!:Phaser.GameObjects.Particles.ParticleEmitter;
	
	/** The score for each team. Team 1 = 0, Team 2 = 1. */
	private teamScore:number[];

	/** Names of both the teams */
	private teamOneName:string;
	private teamTwoName:string;

	/** Spanw Points */
	private spawnPoint:coordinate[];

	/** The score for each team. Team 1 = 0, Team 2 = 1. */
	private goal:TeamGoal[];

	/** THe types of treats which will randomly re-spawn. */
	private treats:string[];

	/** Whether the fat princess mode is active */
	private fatPrincess:boolean;
	
	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config,baseUrl);
		
		this.player = [];	
		this.spawnPoint = [];
		this.goal = [[],[]];
		this.puck = [];
		this.puckSprite = [];
		this.scoreText = [];
		this.teamScore = [0,0];
		this.teamOneName = "";
		this.teamTwoName = "";
		this.treats = [];
		this.fatPrincess = true;
	}

	/**
	 * Reset all game variables for the start of a new game.
	 */
	private reset()
	{
		/* Ensure game properties are reset when the scene is restarted (for the next new game). */
		this.player = [];	
		this.spawnPoint = [];
		this.goal = [[],[]];
		this.puck = [];
		this.puckSprite = [];
		this.scoreText = [];
		this.teamScore = [0,0];
		this.teamOneName = teamNames[Math.floor(Math.random() * teamNames.length)];
		this.teamTwoName = teamNames[Math.floor(Math.random() * teamNames.length)];
		window.localStorage.setItem('game_team1',this.teamScore[0].toString());
		window.localStorage.setItem('game_team2',this.teamScore[1].toString());	
		window.localStorage.setItem('game_team_name1',this.teamOneName);
		window.localStorage.setItem('game_team_name2',this.teamTwoName);
		window.localStorage.setItem('game_started','true');		
		this.treats = [];
	}

	/**
	 * Returns the name of the game map which should be used.
	 */
	private getMapName():string
	{
		let mapName = ' ';
		/* change the map based on the weather */
		let weatherTemp = (window.localStorage.getItem("temp") as any) as number;
		if (weatherTemp <= 18) {
			mapName = 'level_3';
		} else if (weatherTemp > 18 && weatherTemp <= 21) {
			mapName = 'level_2';
		} else if (weatherTemp > 21 && weatherTemp <= 25) {
			mapName = 'level_5';
		} else if(weatherTemp > 25) {
			mapName = 'level_4';
		} else {
			mapName = 'level_' + (Math.floor(Math.random() * 4) + 2);
		}

		return mapName;
	}

	
	/**
	 * Adds a tile map to the scene.
	 * 
	 * @param mapName The name of the game map which should be added to the scene.
	 */
	private createMap(mapName:string):void
	{
		/* Render the game map created with tiled. (the tile map). */
		this.map = this.make.tilemap({key:mapName});
		const tileset = this.map.addTilesetImage('my_simple_game','tiles');		
		this.map.createStaticLayer('ground', tileset, 0, 0);

		/* Determine player spawn points, and tiles which a designated as being goals. */
		const specialRegions = this.map.getObjectLayer('region')['objects'];
		specialRegions.forEach(region => {
			let tile = this.map.getTileAtWorldXY(region.x!,region.y!-32);
			switch(region.type){
				case 'spawn':
					this.spawnPoint.push({x:region.x!,y:region.y! - region.height!})
					break;
				case 'team_1':					
					this.goal[0].push({x:tile.x,y:tile.y});
					break;
				case 'team_2':
					this.goal[1].push({x:tile.x,y:tile.y})
					break;
			}
		});

		/* Render the candy layer in the game world. */
		this.candyGroup = this.physics.add.group({
			allowGravity: false,
			immovable: true
		});

		const candyObjects = this.map.getObjectLayer('candy')['objects'];
		let candyTypes:string[] = [];
		candyObjects.forEach(candyObject => {
			candyTypes.push(candyObject.type);
			let candy = this.candyGroup.create(candyObject.x!, candyObject.y!,candyObject.type).setOrigin(0,0);
			candy.scaleX = 0.6;
			candy.scaleY = 0.6;
		});

		/* Remove duplicate candy types. */
		this.treats = Array.from(new Set(candyTypes));

		/* Render the obstacle layer in the game world. */
		this.obstacleGroup = this.physics.add.group({
			allowGravity: false,
			immovable: true
		});

		const obstacleObjects = this.map.getObjectLayer('obstacle')['objects'];
		obstacleObjects.forEach(obstacleObject => {
			this.obstacleGroup.create(obstacleObject.x!, obstacleObject.y!,obstacleObject.type).setOrigin(0,0);			
		});
	}

	

	/**
	 * Apply weather effects to the game map.
	 */
	private applyWeather():void
	{
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
		
		
		let status = (window.localStorage.getItem("status") as any) as string;
		if (status === "Rain" || status === "Thunderstorm") {
			this.rain(true);
		} else {
			this.rain(false);
		}
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
		this.reset();''

		/* Pressing "1" on the keyboard places the local player into the game. (debug player.) */
		var one_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
		one_key.on('down',(e:Phaser.Input.Keyboard.Key) => {
			this.addPlayer(GameScene.LOCAL_PLAYER_ID);
		}) 
		
		/* Listen to cursor key events (for controlling the local player with arrow keys) */
		this.cursors = this.input.keyboard.createCursorKeys();

		/* Prevent objects from leaving the map. */
		this.physics.world.setBoundsCollision(true,true,true,true);
	
		/* Add map to scene. */
		let mapName = this.getMapName();
		this.createMap(mapName);

		/* Apply weather effects to the game world. */
		this.applyWeather();

		/* Place puck(s) onto the game board. */
		this.addPuck(400,400);

		/* Position the text for displaying the team score and remaining game time.*/
		this.scoreText[0] = this.add.text(10, 10, `Team ${this.teamOneName}: 0`, {fontSize: '20px', fill: '#000'});
		this.scoreText[0].setVisible(false);
		this.scoreText[1] = this.add.text(10, 40, `Team ${this.teamTwoName}: 0`, {fontSize: '20px', fill: '#000'});
		this.scoreText[1].setVisible(false);
		this.clockText = this.add.text(1280, 10, GameScene.ROUND_TIME.toString(), {fontSize: '60px', fill: '#000'});
		this.clockText.setVisible(false);

		/* Switch to the end game scene after this scene has faded out. */
		let that = this;
		this.cameras.main.on('camerafadeoutcomplete', function () {
			window.localStorage.setItem('game_started','false');
			
			/* Pass the team score to the end game scene. */
			let config:EndSceneConfig = {
				teamScore:that.teamScore,
				teamOneName:that.teamOneName,
				teamTwoName:that.teamTwoName
			};

			that.scene.start('end_scene',config);
		}, this);

		/* Broadcast the start of the game to all players (mobile-clients) */
		this.sendEventToAllPlayers(90);
		
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
			this.physics.collide(this.player[i].sprite,this.puckSprite,this.handlePLayerHitByPuck,undefined,this);/* player collided with puck */
			
			/* Player can collide with obstacles. (must walk around obstacles) */
			this.physics.collide(this.player[i].sprite,this.obstacleGroup,undefined);

			/* Player can collide with candy. (to collect candy) */
			this.physics.overlap(this.player[i].sprite,this.candyGroup,this.handlePlayerOverlapsCandy,undefined,this);			
			
			/* Update player position on the map. */
			this.player[i].update();
		}

		for(var i=0;i<this.puck.length;i++)
		{
			// this.checkPuckInGoal(this.puck[i]);
			this.puck[i].update();
		}
		
		/* Manage object collisions in the game world.*/
		this.physics.collide(this.puckSprite,this.puckSprite,() => {return;});/* pucks collided */
		// this.physics.collide(this.puckSprite,this.candyGroup,() => {return;});/* pucks collided with candy. */
		this.physics.collide(this.puckSprite,this.obstacleGroup,() => {return;});/* puck collided with obstacle. */
		
		/* Manage the local player. (Debug Player) */
		this.updateLocalPlayer()

		/* Update the current remaining game time.*/
		this.clockText.setText(this.timeEvent.repeatCount.toString());
		window.localStorage.setItem('game_clock',this.timeEvent.repeatCount.toString());	
	}

		/**
	 * Gets the trail colour based on number provided
	 * @param index index position of player in the player array
	 */
	private getTrailColour(index: number): string {
		let trail = "NA";

		switch (index) {
			case 0:
				trail = "purple";
				break;
			case 1:
				trail = "red";
				break;
			case 2:
				trail = "green";
				break;
			case 3:
				trail = "orange";
				break;		
			default:
				break;
		}

		return trail;
	}

	/**
	 * Add a new player into the scene. (places a player on the map)
	 * @param id The id used to track this player. (This is usually the UUID that is sent by the mobile
	 * 			 client when connecting to the server.)
	 */
	private addPlayer(id:string)
	{
		if(this.getPlayerById(id)) return;/* prevent adding a player into the game more than once. */
		
		/* Assign player to a team*/
		let team = (this.player.length) % 2;
		let player = new Player(id,this.player.length, team, this);
		let playerTrail = this.getTrailColour((this.player.length) % 4);
		let teamName = team === 0 ? this.teamOneName : this.teamTwoName;
		let teamNumber = team === 0 ? '1' : '2';
		let playerInfo = [teamName, teamNumber, playerTrail];

		/* Spawn player on their designated spawn point. */
		player.sprite.x = this.spawnPoint[this.player.length].x;
		player.sprite.y = this.spawnPoint[this.player.length].y;
		
		/* Send player information to mobile client */
		(this.game as CandyGame).sendEventToPlayer(player.id, 300, playerInfo);

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
			/* Grass */
			case 1:
				player.speed = 230;
				break;
			/* Cobbles */
			case 2:
			case 7:
				player.speed = 330;
				break;	
			/* Water*/
			case 3:
			case 4:
			case 5:
			case 6:
			case 13:
				player.speed = 100;
				break;
			/* Snow */
			case 8:
				player.speed = 230;
				break;
			/* Ice */
			case 9:
				player.speed = 330;
				break;
			/* Sand */
			case 14:
				player.speed = 180;
				break;
			/* Dark Sand */
			case 15:
				player.speed = 280;
				break;
			default:
				player.speed = 330;
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
			let calories = 0
			let candySprite = candyObj as Phaser.Physics.Arcade.Sprite;
			switch(candySprite.texture.key)
			{
				case 'cookie':
					points = 25
					calories = 5
					break
				case 'donut':
					points = 50
					calories = 5
					break
				case 'icecream':
					points = 50
					calories = 5
					break
				case 'lolly':
					points = 10
					calories = 5
					break
				case 'muffin':
					points = 5
					calories = 5
					break 
				case 'swirl':
					points = 10
					calories = 5
					break;
			}
			
			/* Update the players and the teams score. */
			player.calories += calories;
			player.score += points;
			this.scorePointsForTeam(player.team,points);
			
			/* Remove the candy from the game board. */
			candyObj.destroy();	
		
			/* Send a "candy collected" event to the mobile client of the player that just collected candy. */
			(this.game as CandyGame).sendEventToPlayer(player.id,200);
		}
	}

	private scorePointsForTeam(team:number,points:number):void{
		this.teamScore[team] += points;
  
		/* Update score in local storage for sharing with other widgets. */
		window.localStorage.setItem('game_team1',this.teamScore[0].toString());
		window.localStorage.setItem('game_team2',this.teamScore[1].toString());
		
		/* Update the game score board text. */
		this.scoreText[0].text = `Team ${this.teamOneName}: ` + this.teamScore[0];
		this.scoreText[1].text = `Team ${this.teamTwoName}: ` + this.teamScore[1];
	}

	

	private handlePLayerHitByPuck(playerObj:Phaser.Types.Physics.Arcade.GameObjectWithBody,puckObj:Phaser.Types.Physics.Arcade.GameObjectWithBody)
	{
		let player = this.getPlayerById(playerObj.name);
		let puck = this.puck[parseInt(puckObj.name,10)];
		
		/* Ensure players can not hit themselves with a puck. */
		if(player === null || player.id === puck.lastPlayerId) return;

		if(puck.lastPlayerId !== ''){
			console.log('Player', player?.id, 'was hit by',puck.lastPlayerId);
			if(this.fatPrincess){
				player.dropCandy(this.candyGroup);
			}
		}
		
		puck.lastPlayerId = player?.id;
	}

	/**
	 * Checks if a puck is inside one of the defined goals and scores points.
	 * @param puck The puck which is to be checked.
	 */
	private checkPuckInGoal(puck:Puck):void
	{
		/* Determine the tile that the puck is currently on. */
		let tile = this.map.getTileAtWorldXY(puck.sprite.x,puck.sprite.y);
		if(this.isGoal(0,tile))
		{
			puck.sprite.setX(400);
			puck.sprite.setY(200);
			puck.sprite.setVelocity(0);
			this.scorePointsForTeam(1,50);		
			return;
		}
		
		if(this.isGoal(1,tile))
		{
			puck.sprite.setX(800);
			puck.sprite.setY(200);
			puck.sprite.setVelocity(0);	
			this.scorePointsForTeam(0,50);		
			return;
		}
	}

	/**
	 * Checks if the passed in tile is goal tile for the specified team.
	 * Returns true if the tile is designated as goal tile for the specified team.
	 * @param team The team that is being scored against.
	 * @param tile The tile which should be checked for being a goal tile.
	 */
	private isGoal(team:number,tile:Phaser.Tilemaps.Tile):boolean
	{
		if(tile.index !== 12) return false;
		
		for(let i=0;i<this.goal[team].length;i++)
		{
			if(this.goal[team][i].x === tile.x && this.goal[team][i].y === tile.y)
			{
				return true;
			}
		}

		return false;
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
		player.stop();	
	}

	/**
	 * Place a movable puck onto the map.
	 */
	private addPuck(x:number,y:number)
	{
		let puck = new Puck(this.puck.length,this,x,y)
		this.puck.push(puck);
		this.puckSprite.push(puck.sprite);
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
			this.rainEmitter.pause();
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
		/* TODO: Make candy spawning run on its own timer. */
		if(this.timeEvent.repeatCount % 5 === 0 && this.candyGroup.getLength() < 10)
		{
			let x = this.randRange(1,this.map.width) - 1;
			let y = this.randRange(1,this.map.height) - 1;
			let tile = this.map.getTileAt(x,y);
			let candyType = this.treats[this.treats.length * Math.random() | 0]
			let candy = this.candyGroup.create(tile.getCenterX(), tile.getCenterY(),candyType) as Phaser.Physics.Arcade.Sprite;
			candy.setOrigin(0,0);
			candy.setScale(0.6);
		}

		
		/* Currently the game signals the immenent game end by starting to slowly fade out the game with n seconds to go.*/
		if(this.timeEvent.repeatCount === 6 || this.candyGroup.getLength() === 0){
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

	/**
	 * Creates a random number in a range. ()
	 * @param From this integer.
	 * @param To this integer.
	 */
	private randRange(min:number,max:number){
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}