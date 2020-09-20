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
	ws = new WebSocket(process.env.REACT_APP_SOCKET_SERVER as string + '?uuid=' + CFKitUtil.createGUID());
	
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
		}

		this.ws.onclose = () => {
			console.log('client disconnected')			
		}
    }
    /* ########################################################*/
	

	private handleClickMove = (e:React.MouseEvent<HTMLElement>) =>
	{
		e.preventDefault();
		let heading = e.currentTarget.dataset.heading;
		
		if(this.ws.readyState === this.ws.OPEN){
			let data = {
				widget:"game",
				action:"move",
				heading:heading
			}
			this.ws.send(JSON.stringify(data));
		}		
	}

	private handleClickDrive = (e:React.MouseEvent<HTMLElement>) =>
	{
		e.preventDefault();
		if(this.ws.readyState === this.ws.OPEN){
			let data = {
				widget:"game",
				action:"drive"
			}
			this.ws.send(JSON.stringify(data));
			console.log('Data Sent',data)
		}		
	}

	private handleClickTurn = (e:React.MouseEvent<HTMLElement>) =>
	{
		e.preventDefault();
		let direction = e.currentTarget.dataset.direction;
		
		if(this.ws.readyState === this.ws.OPEN){
			let data = {
				widget:"game",
				action:"turn",
				direction:direction
			}
			this.ws.send(JSON.stringify(data));		
		}		
	}

	/* ########################################################*/
    /* UI Rendering */
	public render() {		
		return(
		<section>
        	<h1>Game client</h1>		
			<button data-heading="N" onClick={this.handleClickMove}>North</button>
			<button data-heading="E" onClick={this.handleClickMove}>East</button>
			<button data-heading="S" onClick={this.handleClickMove}>South</button>
			<button data-heading="W" onClick={this.handleClickMove}>West</button>
			<button onClick={this.handleClickDrive}>Drive</button>
			<button data-direction="left" onClick={this.handleClickTurn}>Left</button>
			<button data-direction="right" onClick={this.handleClickTurn}>Right</button>
		</section>
        )
    }
}

export default GameClient