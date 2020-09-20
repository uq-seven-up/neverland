import React from "react"


interface GameClientProp {}
interface GameClientState {
	dataFromServer:any
}


/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class GameClient extends React.Component<GameClientProp, GameClientState> {    		
	ws = new WebSocket('ws://localhost:3080');
	
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
	

	private handleClick = (e:React.MouseEvent) =>
	{
		e.preventDefault();
		if(this.ws.readyState === this.ws.OPEN){
			let data = {
				message:"Hello from client!"
			}
			this.ws.send(JSON.stringify(data));
			console.log('Data Sent')
		}		
	}

	/* ########################################################*/
    /* UI Rendering */
	public render() {		
		//console.log(this.state.dataFromServer);
		return(
		<section>
        	<h1>Game client</h1>		
			<button onClick={this.handleClick}>Move Up</button>
		</section>
        )
    }
}

export default GameClient