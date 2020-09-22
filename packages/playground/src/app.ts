import * as Phaser from "phaser";
import HelloWorldScene from "./scene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [HelloWorldScene]
}

console.log('Hello World')

export default new Phaser.Game(config)
