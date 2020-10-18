import React from "react"
import {CFKitUtil} from '@7up/common-utils';

enum GameState {
	WAITING,
	PLAYING,
	FULL
}

interface GameClientProp {}
interface GameClientState {
	game:GameState,
	playerId:string,
	enableMusic:boolean,
	enableSound:boolean,
	tracking: boolean,
	comment: string
}

interface CartesianCoordinates{
	x: number,
	y: number
}

interface PolarCoordinates{
	bearing: number,
	radius: number
}


/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class GameClient extends React.Component<GameClientProp, GameClientState> {    			
	private ws:any;
	private music?:HTMLAudioElement;
	private chimeSound?:HTMLAudioElement;
	
	constructor(props: GameClientProp) {
        super(props)
		/* 
		NOTE: REACT call a constructor twice in strict mode. Which is why the websocket code is not here.
		https://github.com/facebook/react/issues/12856#issuecomment-613145789
		*/

		/* ensure that a player keeps the same player id, even if they refresh the page, or switch app routes.*/
		let playerId = window.localStorage.getItem('playerId');
		if(playerId === null)
		{
			playerId = CFKitUtil.createGUID();
			window.localStorage.setItem('playerId',playerId);
		}

		this.state = {
			game:GameState.WAITING,
			enableMusic:false,
			enableSound:false,
			playerId:playerId,
			tracking: false,
			comment: "No comment"
        }
    }

    /* ########################################################*/
    /* React life-cycle methods.*/
    public componentDidMount(): void {
		this.connect();
    }
	
	/* ########################################################*/
	private connect = () =>
	{
		let socketServerHost = 'ws://' + window.location.hostname + ':3080'
		this.ws = new WebSocket(socketServerHost + '?uuid=' + this.state.playerId);
		this.ws.onopen = () => {
			this.ws.send(`g|j|${this.state.playerId}`);
			console.log('Game client connected to server.')
		}

		this.ws.onmessage = (evt:any) => {
			// listen to data sent from the websocket server
			let message = evt.data as string;
			
			console.log(message)
			if(message.startsWith('c|') || message.startsWith('b|'))
			{
				let data = message.split('|');
				if(data[1] === 'v')
				{
					switch(data[3])
					{
						/* Game Invite.*/
						case '95':
							console.log('accept invite');
							this.ws.send(`g|j|${this.state.playerId}`);
							break;
						/* Game is full.*/
						case '110':
							this.setState({game:GameState.FULL})																				
							break;
						/* Joined game.*/
						case '120':
							this.setState({game:GameState.PLAYING})																				
							break;
						/* Collected and item. */
						case '200':
							if(window.navigator.vibrate)
							{
								window.navigator.vibrate([30]);
							}
							if(this.state.enableSound)
							{
								this.chimeSound!.play()
							}																					
							break;
						default:
					}
					
				}	
			}
		}

		this.ws.onclose = () => {
			let that = this;
			console.log('Game client disconnected, retry reconnect in two seconds.')	
			setTimeout(function() {
			that.connect();
			}, 2000);		
		}
	}

	/* Music methods */
	private toggleSound = () => {
		if(!this.chimeSound)
		{
			this.chimeSound = new Audio('/client-mobile/sound/chime.mp3');
		}
		this.setState({enableSound:!this.state.enableSound});
	}

	private toggleMusic = () => {
		if(!this.music)
		{
			this.music = new Audio('/client-mobile/sound/423350__sieuamthanh__rung-sang-sac.mp3');
			this.music.loop = true;
		}
		/* 	Remember we are toggling the music BEFORE we set the correct value for the 
			enableMusic state.*/
		if(this.state.enableMusic){
			this.music.pause();
		} else {
			this.music.play();
			this.music.volume = 0.5;
		}
		this.setState({enableMusic:!this.state.enableMusic});
	}

	/* Event handler for movement */
	private getRelativeCoordinates(x: number, y: number, rect: DOMRect){
		var result: CartesianCoordinates = {x: 0, y:0};
		var width = rect.width;
		var height = rect.height;
		result = {x: x - rect['x'] - width / 2, y: y - rect['y'] - height / 2};
		return result;
	}

	private getPolarCoordinates(x: number, y: number) {
		var trackGetter = document.querySelector('.trackpad');
		let trackpad: Element;
		var result: PolarCoordinates = {bearing: 0, radius:0};

		if(trackGetter === null) {
			return result;
		}
		trackpad = trackGetter;
		var rect = trackpad.getBoundingClientRect();
		var cartesian: CartesianCoordinates = this.getRelativeCoordinates(x, y, rect);

		var radius = Math.sqrt(Math.pow(cartesian.x, 2) + Math.pow(cartesian.y, 2));
		var bearing = Math.atan(cartesian.y/cartesian.x);

		if(cartesian.x < 0) {
			bearing += Math.PI;
		}
		else if(cartesian.x > 0 && cartesian.y < 0) {
			bearing += 2 * Math.PI;
		}

		result.bearing = bearing;
		result.radius = radius;

		return result;
	}

	private getCardinal(x: number, y: number){
		let polar = this.getPolarCoordinates(x, y);

		var bearing = polar.bearing;
		bearing -= (1/8 * Math.PI);

		if(bearing < 0) {
			return 'e';
		}

		var index = Math.floor(bearing / (Math.PI * 2 / 8));
		var directions = ['se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];

		return directions[index];
	}

	private handleMouseDown = (e:React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		this.setState({tracking: true});
		let x = e.clientX;
		let y = e.clientY;
		let heading = this.getCardinal(x, y);
		this.createParticleAtPoint(x, y);
		if(this.ws.readyState === this.ws.OPEN){			
			this.ws.send(`g|${heading}|${this.state.playerId}`);
		}
	}

	private handleMouseMove = (e:React.MouseEvent<HTMLElement>) =>
	{
		if(!this.state.tracking) {
			return;
		}

		e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		let x = e.clientX;
		let y = e.clientY;
		let heading = this.getCardinal(x, y);
		this.createParticleAtPoint(x, y);
		if(this.ws.readyState === this.ws.OPEN){			
			this.ws.send(`g|${heading}|${this.state.playerId}`);
		}

		this.setState({comment: `X ${x} Y ${y}`});
	}

	private handleMouseUp = (e:React.MouseEvent<HTMLElement>) => {
		e.preventDefault();		
		e.preventDefault();		
		if(this.ws.readyState === this.ws.OPEN){			
			this.ws.send(`g|h|${this.state.playerId}`);
		}	

		this.setState({tracking: false});
	}

	private handleTouchStart = (e:React.TouchEvent<HTMLElement>) =>
	{
		e.preventDefault && e.preventDefault();
      	e.stopPropagation && e.stopPropagation();
		this.setState({tracking: true});
		let x = e.touches[0].clientX;
		let y = e.touches[0].clientY;
		let heading = this.getCardinal(x, y);
		this.createParticleAtPoint(x, y);
		if(this.ws.readyState === this.ws.OPEN){			
			this.ws.send(`g|${heading}|${this.state.playerId}`);
		}
	}

	private handleTouchMove = (e:React.TouchEvent<HTMLElement>) => {
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
		let x = e.touches[0].clientX;
		let y = e.touches[0].clientY;
		let heading = this.getCardinal(x, y);
		this.createParticleAtPoint(x, y);
		if(this.ws.readyState === this.ws.OPEN){			
			this.ws.send(`g|${heading}|${this.state.playerId}`);
		}
	}

	private handleTouchEnd = (e:React.TouchEvent<HTMLElement>) =>
	{
		e.preventDefault();
		if(this.ws.readyState === this.ws.OPEN){			
			this.ws.send(`g|h|${this.state.playerId}`);
		}		
		this.setState({tracking: false});
	}

	/* Particle Effect */
	private createParticleAtPoint(x: number, y:number) {
		var particleContainer = document.querySelector(".gamePad");
		var scaling = 20;
		for(var i = 0; i < 5; i++) {
			var dot = document.createElement("div");
			dot.classList.add("dot");

			var pos = Math.random() < 0.5;
			var xvalue: number;
			var yvalue: number;

			if(pos){
				xvalue = x + Math.floor(Math.random() * scaling);
			}
			else {
				xvalue = x - Math.floor(Math.random() * scaling);
			}

			pos = Math.random() < 0.5;

			if(pos){
				yvalue = y + Math.floor(Math.random() * scaling);
			}
			else {
				yvalue = y - Math.floor(Math.random() * scaling);
			}

			var size = Math.floor(Math.random() * scaling);
			dot.style.width = size + "px";
			dot.style.height = size + "px";
			dot.style.top = yvalue + "px";
			dot.style.left = xvalue + "px";
			dot.style.backgroundColor = "rgb(" + Math.floor(Math.random() * 255) + ",0," + Math.floor(Math.random() * 255) + ")";
			particleContainer?.appendChild(dot);
		}
	}

	/* ########################################################*/
	/* UI Rendering */
	private renderGameFull()
	{
		return(<h1>Game is full.</h1>)
	}

	private renderGameActive()
	{
		return(
			<>
			{/* <div>{this.state.comment}</div> */}
				<div className="gamePad">
					<div className="trackpad" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onTouchMove={this.handleTouchMove} onMouseDown={this.handleMouseDown} onMouseMove={((e)=>this.handleMouseMove(e))} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseUp}>
						<div></div>
					</div>
				</div>
				<div className='gamebuttons'>
				<button onClick={this.toggleSound}>{this.state.enableSound ? 'Disable Sound' : 'Enable Sound'}</button>
				<button onClick={this.toggleMusic}>{this.state.enableMusic ? 'Disable Music' : 'Enable Music'}</button>
				</div>
			</>
		)
	}

	public render() {		
		let content:JSX.Element;
		if(this.state.game === GameState.FULL)
		{
			content = this.renderGameFull();
		}else
		{
			content = this.renderGameActive();
		}
		
		return(
		<section>
			<div className='header'>
                <figure></figure>
            
			{content}
			</div>
		</section>
        )
    }
}

export default GameClient