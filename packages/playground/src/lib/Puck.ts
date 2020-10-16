import * as Phaser from "phaser";

export default class Puck{
	/** The index of this puck in the puck arrays. */
	private _idx:number;

	/** Reference to the sprite representing this puck in the game world. */
	private _sprite!:Phaser.Physics.Arcade.Sprite;

	/** The id of the last player to make contact with this puck. */
	public lastPlayerId:string;

	constructor(idx:number,scene:Phaser.Scene,x:number,y:number)
	{
		this._idx = idx;
		this.lastPlayerId = '';

		/* Place the puck into the scene.*/
		this._sprite = scene.physics.add.sprite(x,y,'puck');
		this._sprite.setName(this._idx.toString());
		this._sprite.setCollideWorldBounds(true);
		this._sprite.setBounce(0.9,0.9);
		this._sprite.setFriction(20);
		this._sprite.body.isCircle = true;
		this._sprite.setAngularVelocity(50);
	}

	public get idx():number {
		return this._idx;
	}

	public set idx(value:number) {
		this._idx = value;
	}

	public get sprite() {
		return this._sprite;
	}

	public set sprite(value:Phaser.Physics.Arcade.Sprite) {
		this._sprite = value;
	}

	/** Called as part of the game loop. */
	public update() {
		if(this._sprite.body.velocity.x + this._sprite.body.velocity.y === 0)
		{
			this.lastPlayerId = '';
		}
	}
}