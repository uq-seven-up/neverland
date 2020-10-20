import * as Phaser from "phaser";

/**
 * Manages a player as well as the player character.
 */
export default class Player{
	/** The unique identifier for this player. In practice this is the UUID set by the mobile-client. */
	private _id:string;
	
	/** The players index position. */
	private _idx:number;

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

	/** Tracks how much calories of candy the player has consumed. */
	private _calories:number;
	
	/** The team that this player is on. 0=Team 1, 1=Team 2. */
	private _team:number;

	/** The trail of particles following a player as they move. */
	private _trail:Phaser.GameObjects.Particles.ParticleEmitter
	
	constructor(id:string,idx:number,team:number,scene:Phaser.Scene)
	{
		this._id = id;
		this._idx = idx;
		this._speed_x = 0;
		this._speed_y = 0;
		this._score = 0;
		this._calories = 0;
		this._team = team;

		/* Configure the animation used for this player character.*/
		let playersprite = team === 1? "player_cat": "player_dog";
		let walkinganimal = team === 1? "walk_cat": "walk_dog"
		scene.anims.create({
			key: walkinganimal,
			frameRate: 24,
			frames: scene.anims.generateFrameNames(playersprite, {
				prefix: "Walk_",
				suffix: ".png",
				start: 1,
				end: 10,
				zeroPad: 1
			}),
			repeat: -1
		});

		/* 
		Make particle trails, when player walks. 
		note: 
		The particles must be added to the scene before the sprite, otherwise
		the particles will render over the top of the sprite. i.e. The order
		in which game object are added to the scene determines the z-index.
		*/
		let texture = '';
		switch(this._idx)
		{
			case 0:
				texture = 'trail_0';
				break;
			case 1:
				texture = 'trail_1';
				break;
			case 2:
				texture = 'trail_2';
				break;
			case 3:
				texture = 'trail_3';
				break;
			default:
				texture = 'trail_0';
		}
		
		
		var particles = scene.add.particles(texture);
		this._trail = particles.createEmitter({
			speed: 50,
			scale: { start: 0, end: 1 },
			angle:{ min: 180, max: 360 },
			lifespan:300
		});
		this._trail.visible = false;
		this._trail.pause();
		

		/* Place the player into the scene.*/
		this._sprite = scene.physics.add.sprite(50,200,playersprite);		
		
		this._sprite.setMass(2);
		this._sprite.setFriction(1);
		this._sprite.setBounce(0);
		this._sprite.body.isCircle = true;

		/* Allow the player to be identified from the sprite. */
		this._sprite.setName(this._id);
		
		/* Stop the player from leaving the screen. */
		this._sprite.setCollideWorldBounds(true);
		
		/* Start the walk animation. */
		this._sprite.play(walkinganimal);
		this._sprite.anims.pause(this._sprite.anims.currentAnim.frames[1]);
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

	public set calories(value:number) {
		this._calories = value;
	}

	public get calories() {
		return this._calories;
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
		}

		//this._trail.startFollow(this._sprite,this._speed_x * -20,this._speed_y * -20,true);
		this._trail.startFollow(this._sprite,0,28,true);
		this._trail.resume();
		this._trail.visible = true;
		this._sprite.anims.resume();
	}

	/**
	 *  Makes the player character stationary.
	 */
	public stop(){
		this._speed_x = 0;
		this._speed_y = 0;
		this._trail.visible = false;
		this._trail.pause();
		this._sprite.anims.pause(this._sprite.anims.currentAnim.frames[1]);
	}

	/**
	 * Drops collected candy onto the gameboard.
	 * @param candyGroup The candy group to which dropped candy will be added.
	 */
	public dropCandy(candyGroup:Phaser.Physics.Arcade.Group) {
		if(this.calories === 0) return;
		if(candyGroup.getLength() > 15) return;
		
		var explosion = candyGroup.scene.add.particles('explosion');
		explosion.createEmitter({
			frame: [ 'smoke-puff', 'cloud', 'smoke-puff' ],
			angle: { min: 240, max: 300 },
			speed: { min: 200, max: 300 },
			quantity: 6,
			lifespan: 2000,
			alpha: { start: 1, end: 0 },
			scale: { start: 1.5, end: 0.5 },
			on: false
		});
		explosion.createEmitter({
			frame: 'muzzleflash2',
			lifespan: 200,
			scale: { start: 2, end: 0 },
			rotate: { start: 0, end: 180 },
			on: false
		});

		explosion.emitParticleAt(this._sprite.x, this._sprite.y);

		var particles = candyGroup.scene.add.particles('spritesheet');
		var candyEmitter = particles.createEmitter({
			frame: [18,19,20,21,22,23],
			lifespan: 800,
			speed: 300,
			quantity: 3,
			maxParticles:10,
			scale: { start: 0.2, end: 0.6},
			on: true,
			x:this._sprite.x,
			y:this._sprite.y,
			deathCallback:true,
			radial:true,
			angle:{min:0,max:360},
			blendMode:Phaser.BlendModes.ADD
		});

		candyEmitter.acceleration = true;	
		candyEmitter.deathCallback = (particle:Phaser.GameObjects.Particles.Particle):void =>
		{
			let texture = '';
			let index = parseInt(particle.frame.name,10);
			switch(index)
			{
				case 18:
					texture = 'donut';
					break;
				case 19:
					texture = 'swirl';
					break;
				case 20:
					texture = 'lolly';
					break;
				case 21:
					texture = 'muffin';
					break;
				case 22:
					texture = 'cookie';
					break;
				case 23:
					texture = 'icecream';
					break;
				default:
					texture = 'lolly';

			}
			
			let candy = candyGroup.create(particle.x - 32, particle.y - 32,texture).setOrigin(0,0);
			candy.scaleX = 0.6;
			candy.scaleY = 0.6;
		}

		this._calories = 0;
	}

	/** Called when the player is taken out of the game. */
	public destroy() {
		this._sprite.destroy();
	}

	/** Called as part of the game loop. */
	public update() {
		let speedScale = 1;
		if(this._calories > 40)
		{
			speedScale = 0.6;
			this._sprite.scale = 1.9;
		}else if (this.calories > 20)
		{
			speedScale = 0.7;
			this._sprite.scale = 1.5;
		}else if (this.calories > 10)
		{
			speedScale = 0.8;
			this._sprite.scale = 1.2;
		}else{
			speedScale = 1;
			this._sprite.scale = 1;
		}
		
		/* Move the player inside of the game world.*/
		this._sprite.body.velocity.x = this._speed_x * this._speed * speedScale;
		this._sprite.body.velocity.y = this._speed_y * this._speed * speedScale;
	}
}
