import * as Phaser from "phaser";

const logoImg = require('./assets/logo.png')
export default class HelloWorldScene extends Phaser.Scene
{
	constructor()
	{
		super('hello-world')
	}

	preload() {
		//this.load.setBaseURL('/client-screen/');
		this.load.image("logo", logoImg);
	}

	create() {
		const logo = this.add.image(400, 150, "logo");
	  
		var particles = this.add.particles('red');
	  
		  var emitter = particles.createEmitter({
			  speed: 100,
			  scale: { start: 1, end: 0 },
			  blendMode: 'ADD'
		  });
		  emitter.startFollow(logo);
	  
	  
		this.tweens.add({
		  targets: logo,
		  y: 450,
		  duration: 2000,
		  ease: "Power2",
		  yoyo: true,
		  loop: -1
		});
	  }
}