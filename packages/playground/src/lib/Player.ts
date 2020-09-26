import * as Phaser from "phaser";

export default class Player{

	private _id:string;
	private _sprite!:Phaser.GameObjects.Sprite;
	private _speed:number = 1.5;
	private _speed_x:number;
	private _speed_y:number;

	constructor(id:string)
	{
		this._id = id;
		this._speed_x = 0;
		this._speed_y = 0;
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

	public set sprite(value:Phaser.GameObjects.Sprite) {
		this._sprite = value;
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
				break;
			case 'e':
				this._speed_x = 1 * this._speed;
				this._speed_y = 0;
				break;
			case 'se':
				this._speed_x = 1 * this._speed;
				this._speed_y = 1 * this._speed;
				break;
			case 's':
				this._speed_x = 0;
				this._speed_y = 1 * this._speed;
				break;
			case 'sw':
				this._speed_x = -1 * this._speed;
				this._speed_y = 1 * this._speed;
				break;
			case 'w':
				this._speed_x = -1 * this._speed;
				this._speed_y = 0;
				break;
			case 'nw':
				this._speed_x = -1 * this._speed;
				this._speed_y = -1 * this._speed;
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
		this._sprite.x += this._speed_x;
		this._sprite.y += this._speed_y;
	}
}
