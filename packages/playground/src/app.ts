import * as Phaser from "phaser";
import HelloWorldScene from "./scene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 896,
	height: 448,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	parent: 'phaser-game',
	transparent:false,
	scene: [HelloWorldScene]
}

console.log('Hello World')

export default new Phaser.Game(config)
