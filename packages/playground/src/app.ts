import * as Phaser from "phaser";
import CandyGame from "./CandyGame";

/** 
 * Configuration for the phaser game engine.
 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
 */
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

/* Kick off the game launch. */
let game = new CandyGame(config)
export default game;