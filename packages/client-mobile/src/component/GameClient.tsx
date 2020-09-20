import React from "react"
import {CFKitUtil} from '@7up/common-utils';

interface GameClientProp {}
interface GameClientState {
	dataFromServer:any
}


/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class GameClient extends React.Component<GameClientProp, GameClientState> {    		
	ws = new WebSocket('ws://localhost:3080/?uuid=' + CFKitUtil.createGUID());
	
	constructor(props: GameClientProp) {
        super(props)
		
        this.state = {
			dataFromServer:'none'	
        }
    }

    /* ########################################################*/
    /* React life-cycle methods.*/
    public componentDidMount(): void {
		
		console.log('GameClient mounted');
		this.ws.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('connected to web socket server.')
		}

		this.ws.onmessage = (evt:any) => {
			// listen to data sent from the websocket server
			const message = JSON.parse(evt.data)
			this.setState({dataFromServer: message})
			console.log(message)
		}

		this.ws.onclose = () => {
			console.log('client disconnected')			
		}
    }
    /* ########################################################*/
	

	private handleClick = (e:React.MouseEvent<HTMLElement>) =>
	{
		e.preventDefault();
		let heading = e.currentTarget.dataset.heading;
		console.log('heading',heading)
		
		if(this.ws.readyState === this.ws.OPEN){
			let data = {
				widget:"game",
				action:"move",
				heading:heading
			}
			this.ws.send(JSON.stringify(data));
			console.log('Data Sent',data)
		}		
	}

	/* ########################################################*/
    /* UI Rendering */
	public render() {		
		//console.log(this.state.dataFromServer);
		return(
		<section>
        	<h1>Game client</h1>		
			<button data-heading="N" onClick={this.handleClick}>North</button>
			<button data-heading="E" onClick={this.handleClick}>East</button>
			<button data-heading="S" onClick={this.handleClick}>South</button>
			<button data-heading="W" onClick={this.handleClick}>West</button>
		</section>
        )
    }
}

export default GameClient