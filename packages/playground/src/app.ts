import * as Phaser from "phaser";
import HelloWorldScene from "./scene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1400,
	height: 704,
	physics: {
		default: 'arcade',
		arcade: {
			debug:false,
			gravity: { y: 0 }
		}
	},
	parent: 'phaser-game',
	transparent:false,
	scene: [HelloWorldScene]
}

console.log('Hello World')

export default new Phaser.Game(config)
