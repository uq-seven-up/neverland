import * as Phaser from "phaser";
import CandyGame from "./CandyGame";

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
	transparent:false
}

let game = new CandyGame(config)
export default game;