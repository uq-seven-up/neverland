import * as Phaser from "phaser";

export default class Player{

	private _id:string;
	private _sprite!:Phaser.Physics.Arcade.Sprite;
	private _speed:number = 200;
	private _speed_x:number;
	private _speed_y:number;
	private _score:number;

	constructor(id:string,scene:Phaser.Scene)
	{
		this._id = id;
		this._speed_x = 0;
		this._speed_y = 0;
		this._score = 0;

		scene.anims.create({
			key: "walk",
			frameRate: 7,
			frames: scene.anims.generateFrameNames("player", {
				prefix: "Walk_",
				suffix: ".png",
				start: 1,
				end: 10,
				zeroPad: 1
			}),
			repeat: -1
		});

		this._sprite = scene.physics.add.sprite(50,200,'player');		
		this._sprite.setName(this._id);
		this._sprite.setCollideWorldBounds(true);
		this._sprite.play("walk");
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

	public move(heading:string){
		switch(heading)
		{
			case 'n':
				this._speed_x = 0;
				this._speed_y = -1 * this._speed;
				break;
			case 'ne':
				this._speed_x = 1 * this._speed;
				this._speed_y = -1 * this._speed;
				this._sprite.flipX = false;
				break;
			case 'e':
				this._speed_x = 1 * this._speed;
				this._speed_y = 0;
				this._sprite.flipX = false;
				break;
			case 'se':
				this._speed_x = 1 * this._speed;
				this._speed_y = 1 * this._speed;
				this._sprite.flipX = false;
				break;
			case 's':
				this._speed_x = 0;
				this._speed_y = 1 * this._speed;				
				break;
			case 'sw':
				this._speed_x = -1 * this._speed;
				this._speed_y = 1 * this._speed;
				this._sprite.flipX = true;
				break;
			case 'w':
				this._speed_x = -1 * this._speed;
				this._speed_y = 0;
				this._sprite.flipX = true;
				break;
			case 'nw':
				this._speed_x = -1 * this._speed;
				this._speed_y = -1 * this._speed;
				this._sprite.flipX = true;
				break;
			default:
				this._speed_x = 0;
				this._speed_y = 0;
		}
	}

	public destroy() {
		this._sprite.destroy();
	}

	public stop(){
		this._speed_x = 0;
		this._speed_y = 0;
	}

	public update() {
		this._sprite.body.velocity.x = this._speed_x;
		this._sprite.body.velocity.y = this._speed_y;
	}
}
