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
			// const message = JSON.parse(evt.data)		
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

	/* ########################################################*/
    /* UI Rendering */
	public render() {		
		return(
		<section>
        	<h1>Game client</h1>		
			<button data-heading="n" onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>North</button>
			<button data-heading="e" onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>East</button>
			<button data-heading="s" onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>South</button>
			<button data-heading="w" onMouseDown={this.handleClickMove} onMouseUp={this.handleClickStop}>West</button>			
		</section>
        )
    }
}

export default GameClient