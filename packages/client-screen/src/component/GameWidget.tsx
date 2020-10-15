import React from "react"
import {GameMap} from '@7up/common-types';
import {GameBoard} from '@7up/common-utils'

interface GameWidgetProp {id?:string}
interface GameWidgetState {
	gameMap:GameMap
}

/**
 * This widget is a proof of concept implementation of a 
 * react component using a class.
 */
class GameWidget extends React.Component<GameWidgetProp, GameWidgetState> {    
	ws = new WebSocket(process.env.REACT_APP_SOCKET_SERVER as string);
	
	constructor(props: GameWidgetState) {
        super(props as any)
		
        this.state = {
			gameMap:new Map() as GameMap	
        }
    }

    /* ########################################################*/
    /* React life-cycle methods.*/
    public componentDidMount(): void {		
		this.ws.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('Connected to web socket.')
		}

		this.ws.onmessage = (evt:any) => {
			// listen to data sent from the websocket server
			const data = JSON.parse(evt.data)
			
			if(data.gameMap)
			{
				/* Transform received gameMap data to a Map type.*/
				let gameMap = new Map() as GameMap;  
				for (var value in data.gameMap) {  
					gameMap.set(value,data.gameMap[value])  
				} 								
				
				this.setState({gameMap:gameMap})
			}
		}

		this.ws.onclose = () => {
			console.log('client disconnected')			
		}
    }
    /* ########################################################*/

	/* ########################################################*/
    /* UI Rendering*/
    public render() {						
		return (		
            <GameBoard id={this.props.id} cols={10} rows={10} gameMap={this.state.gameMap}></GameBoard> 
        )
    }
}

export default GameWidget