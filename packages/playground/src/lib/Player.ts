import * as Phaser from "phaser";

/**
 * Manages a player as well as the player character.
 */
export default class Player{
	/** The unique identifier for this player. In practice this is the UUID set by the mobile-client. */
	private _id:string;
	
	/** Reference to the sprite representing this player in the game world. */
	private _sprite!:Phaser.Physics.Arcade.Sprite;
	
	/** The players current movement speed. (note in the game this is changed based on the tile the user is standing on.) */
	private _speed:number = 200;
	
	/** The x direction that is applied for movement. 1=right, -1=left. */
	private _speed_x:number;
	
	/** The y direction that is applied for movement. 1=down, -1=up. */
	private _speed_y:number;
	
	/** The total points accumalated by this player. */
	private _score:number;
	
	/** The team that this player is on. 0=Team 1, 1=Team 2. */
	private _team:number;

	/** The trail of particles following a player as they move. */
	private _trail:Phaser.GameObjects.Particles.ParticleEmitter
	
	constructor(id:string,team:number,scene:Phaser.Scene)
	{
		this._id = id;
		this._speed_x = 0;
		this._speed_y = 0;
		this._score = 0;
		this._team = team;

		/* Configure the animation used for this player character.*/
		let playersprite = team === 1? "player_cat": "player_dog";
		let walkinganimal = team === 1? "walk_cat": "walk_dog"
		scene.anims.create({
			key: walkinganimal,
			frameRate: 7,
			frames: scene.anims.generateFrameNames(playersprite, {
				prefix: "Walk_",
				suffix: ".png",
				start: 1,
				end: 10,
				zeroPad: 1
			}),
			repeat: -1
		});

		/* Place the player into the scene.*/
		this._sprite = scene.physics.add.sprite(50,200,playersprite);		
		
		/* Allow the player to be identified from the sprite. */
		this._sprite.setName(this._id);
		
		/* Stop the player from leaving the screen. */
		this._sprite.setCollideWorldBounds(true);
		
		/* Start the walk animation. */
		this._sprite.play(walkinganimal);

		/* Make particle trails, when player walks. */
		var particles = scene.add.particles('trail_0');	  
		this._trail = particles.createEmitter({
			speed: 100,
			scale: { start: 1, end: 0 },
			blendMode: 'ADD'
		});
	}

	public get id():string {
		return this._id;
	}

	public set id(value:string) {
		this._id = value;
	}

	public get sprite() {
		return this._sprite;
	}

	public set sprite(value:Phaser.Physics.Arcade.Sprite) {
		this._sprite = value;
	}

	public set score(value:number) {
		this._score = value;
	}

	public get score() {
		return this._score;
	}

	public set speed(value:number) {
		this._speed = value;
	}

	public get speed() {
		return this._speed;
	}

	public set team(value:number) {
		this._team = value;
		
		/* For now tint the players which are on the 'other' team. */
		// if(this._team % 2 === 1)
		// {
		// 	this._sprite.tint = 0xCCCC00;
		// }
	}

	public get team() {
		return this._team;
	}

	/**
	 * Moves the player character towards the specified heading.
	 * @param heading Compass directions.(n,ne,e,se,s,sw,w,nw)
	 */
	public move(heading:string){
		
		switch(heading)
		{
			case 'n':
				this._speed_x = 0;
				this._speed_y = -1;
				break;
			case 'ne':
				this._speed_x = 1;
				this._speed_y = -1;
				this._sprite.flipX = false;
				break;
			case 'e':
				this._speed_x = 1;
				this._speed_y = 0;
				this._sprite.flipX = false;
				break;
			case 'se':
				this._speed_x = 1;
				this._speed_y = 1;
				this._sprite.flipX = false;
				break;
			case 's':
				this._speed_x = 0;
				this._speed_y = 1;				
				break;
			case 'sw':
				this._speed_x = -1;
				this._speed_y = 1;
				this._sprite.flipX = true;
				break;
			case 'w':
				this._speed_x = -1;
				this._speed_y = 0;
				this._sprite.flipX = true;
				break;
			case 'nw':
				this._speed_x = -1;
				this._speed_y = -1;
				this._sprite.flipX = true;
				
				break;
			default:
				this._speed_x = 0;
				this._speed_y = 0;
		}

		this._trail.startFollow(this._sprite,this._speed_x * -60,this._speed_y * -60,true);
		this._trail.resume();
		this._trail.visible = true;
	}

	/**
	 *  Makes the player character stationary.
	 */
	public stop(){
		this._speed_x = 0;
		this._speed_y = 0;
		this._trail.visible = false;
		this._trail.pause();

	}

	/** Called when the player is taken out of the game. */
	public destroy() {
		this._sprite.destroy();
	}

	/** Called as part of the game loop. */
	public update() {
		/* Move the player inside of the game world.*/
		this._sprite.body.velocity.x = this._speed_x * this._speed;
		this._sprite.body.velocity.y = this._speed_y * this._speed;
	}
}
