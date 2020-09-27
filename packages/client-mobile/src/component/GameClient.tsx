import React from "react"
import {CFKitUtil} from '@7up/common-utils';

interface GameClientProp {}
interface GameClientState {
	playerId:string
}


/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class GameClient extends React.Component<GameClientProp, GameClientState> {    			
	private ws:any;
	constructor(props: GameClientProp) {
        super(props)
		/* 
		NOTE: REACT call a constructor twice in strict mode. Which is why the websocket code is not here.
		https://github.com/facebook/react/issues/12856#issuecomment-613145789
		*/
		this.state = {
			playerId:CFKitUtil.createGUID()	
        }
    }

    /* ########################################################*/
    /* React life-cycle methods.*/
    public componentDidMount(): void {
		this.ws = new WebSocket(process.env.REACT_APP_SOCKET_SERVER as string + '?uuid=' + this.state.playerId);
		this.ws.onopen = () => {
			this.ws.send(`g|j|${this.state.playerId}`);
			console.log('Game client connected to server.')
		}

		this.ws.onmessage = (evt:any) => {
			// listen to data sent from the websocket server
			let message = evt.data as string;
			
			console.log(message)
			if(message.startsWith('c|'))
			{
				let data = message.split('|');
				if(data[1] === 'v')
				{
					switch(data[3])
					{
						case '200':
							new Audio('/client-mobile/sound/chime.mp3').play();
							console.log('hello')
							break;
						default:
					}
					
				}	
			}
		}

		this.ws.onclose = () => {
			console.log('Game client disconnected')			
		}
    }
    /* ########################################################*/
	

	private handleClickMove = (e:React.MouseEvent<HTMLElement>) =>
	{
		e.preventDefault();
		let heading = e.currentTarget.dataset.heading;
		
		if(this.ws.readyState === this.ws.OPEN){			
			this.ws.send(`g|${heading}|${this.state.playerId}`);
		}								
	}

	private handleClickStop = (e:React.MouseEvent<HTMLElement>) =>
	{
		e.preventDefault();		
		if(this.ws.readyState === this.ws.OPEN){			
			this.ws.send(`g|h|${this.state.playerId}`);
		}		
	}

	private handleTouchStart = (e:React.TouchEvent<HTMLElement>) =>
	{
		e.preventDefault && e.preventDefault();
      	e.stopPropagation && e.stopPropagation();
      	let heading = e.currentTarget.dataset.heading;
		
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
	}


	/* ########################################################*/
    /* UI Rendering */
	public render() {		
		return(
		<section>
        	<div className="gamePad">
				<div data-heading="n" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>&#8593;</div>
				<div data-heading="ne" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>&#8599;</div>
				<div data-heading="e" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>&#8594;</div>
				<div data-heading="se" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>&#8600;</div>
				<div data-heading="s" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>&#8595;</div>
				<div data-heading="sw" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>&#8601;</div>
				<div data-heading="w" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>&#8592;</div>
				<div data-heading="nw" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>&#8598;</div>			
			</div>
		</section>
        )
    }
}

export default GameClient