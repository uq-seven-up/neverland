import * as Phaser from "phaser";
import AbstractScene from "./AbstractScene"
import { API } from '@7up/common-utils';
import { AxiosResponse } from 'axios';

/**
 * Configuration data expected by the EndScene.
 */
export declare interface EndSceneConfig {
	teamScore:number[],
	teamOneName: string,
	teamTwoName: string
}

/**
 * Manage the end of the game scene.
 */
export default class EndScene extends AbstractScene  
{
	constructor(config:Phaser.Types.Scenes.SettingsConfig,baseUrl:string)
	{
		super(config,baseUrl);
	}

	/**
	 * Phaser life cycle method. (This method is called by the Scene Manager when the scene starts, after init() and preload())
	 * https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
	 */
	public create(data:EndSceneConfig):void {
		this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0)');
		
		/* Display end game text. */
		this.add.text(500, 300, 'The End', {fontSize: '80px', fill: '#fff'});
		if(data.teamScore[0] > 1)
		{
			this.storeTeamDetails(`${data.teamOneName}`, data.teamScore[0]);
			this.add.text(350, 400, `Team ${data.teamOneName} is the Winner`, {fontSize: '40px', fill: '#fff'});			
		}else{
			this.storeTeamDetails(`${data.teamOneName}`, data.teamScore[1]);
			this.add.text(350, 400, `Team ${data.teamTwoName} is the Winner`, {fontSize: '40px', fill: '#fff'});
		}
		
		/* Switch to the intro scene after this scene has faded out. */
		let that = this;
		this.cameras.main.on('camerafadeoutcomplete', function () {
			that.scene.start('intro_scene')
		}, this);
		
		/* Automatically restart the game afer n milliseconds.*/
		this.time.addEvent({delay:3000, 
			callback:this.restart,
			callbackScope:this});
			
			/* Fade in the end scene. */
			this.cameras.main.fadeIn(1000, 0, 0, 0)
		}
		
		private storeTeamDetails(name: string, score: number) {
			this.callAPI('', 'POST', `/leaderboard/scores?name=${name}&score=${score}`);
		}
		
		/* ########################################################*/
		/* Working methods. */
		/**
		 * Make an API call to the neverland REST server.
		 *
		 * @param name - An arbitrary identifier for this request, this value is passed through to the provide callback.
		 * @param method - The HTTP method that will be used for the request.
		 * @param endpoint - The API endpoint (route) which is called on the REST Server.
		 * @param data - Optional: A simple object which is passed to the REST API inside of the request body.
		 * @param hideBusy - Optional: not implemented yet. (suppresses the loading spinner)
		 * @returns void
		 */
		private callAPI = (
			name: string,
			method: 'GET' | 'POST' | 'PUT' | 'DELETE',
			endpoint: string,
			data?: any,
			hideBusy?: boolean,
			): void => {
				// Parses the baseUrl from the url of the website. Works on both development and production
				let firstBaseUrl = window.location.href.split(':');
				let secondBaseUrl = firstBaseUrl[0] + ":" + firstBaseUrl[1];
				let thirdBaseUrl = secondBaseUrl.split("/");
				let fourthBaseUrl = thirdBaseUrl.slice(0, 3).join("/");
				let finalBaseUrl = fourthBaseUrl + ":3080/api";
				
				new API(finalBaseUrl).call(
					method,
					endpoint,
					(response: AxiosResponse<any>) => {
						if (response.status === 200) {
							console.log(response.data);
						} else if (response.status === 500) {
							alert('Server Error: 500');
						} else {
							alert(response.data.msg.displayTxt);
						}
					},
					data,
					);
				};
		/* ########################################################*/
								
		private restart() {
			/* The end of the fade triggers a camera event, defined inside of the create method */
			this.cameras.main.fade(2000, 0, 0, 0);
		}
}