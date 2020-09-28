import WebSocket from 'ws';

export interface GameWebSocket extends WebSocket
{
	uuid:string
}

/** 
Message Protocol

To optimise speed and bandwidth the game server does NOT use JSON format for data transfer. Instead 
messages are a pipe delimited string.

Position: 
0 = g : Message for the game.
	c : Message for the controller (mobile client)
	b : Broadcast message to all controllers (mobile client)
1 = Game command:
	j : Request to join game.
	n : Move player north.
	ne: Move player north east.
	e : Move player east.
	se: Move player south east.
	s : Move player south.
	sw: Move player south west.
	w : Move player west.
	nw: Move player north west.
	h : Stop player.
	x : Exit game.
	v: Game event.
2 = Identifier for the websocket. When connecting the identifier is passed as the url
	parameter 'uuid' when openeing the connection. (ignored for can be empty for broadcast messages.)
3 = Event type.
	100: Game Ended
	200: Collected an item


Example Message:
Notify the game that the player connect to socket uuid: WER12334PSK should move north.

g|n|WER12334PSK 

Notify the controller used by player on socket uuid WER12334PSK that the player picker up a candy.

c|v|WER12334PSK|200

Notify all game controllers that the game is over.
b|v||100

*/
export class SocketUtil 
{	
	/**
	 * Send data as a JSON string to sockets with the specified uuid.
	 * @param ws Reference to the web socket server.
	 * @param uuid The uuid of the receiveing client socket.
	 * @param data Data which will be encoded and sent.
	 */
	public sendMessage(ws:any,uuid:string,data:any):void
	{					
		ws.clients.forEach(function each(client:any) {
			if (client.uuid === uuid && client.readyState === WebSocket.OPEN) {			
				client.send(JSON.stringify(data));
			}
		});
	}

	/**
	 * Encoded data as a JSON string and broadcast to all connected web socket clients.
	 * @param ws Reference to the web socket server.
	 * @param data Data which will be encoded and sent.
	 */
	public broadCast(ws:any,data:any):void
	{					
		ws.clients.forEach(function each(client:any) {
			if (client.readyState === WebSocket.OPEN) {			
				client.send(JSON.stringify(data));
			}
		});
	}

	/**
	 * Re-route an incoming game message to a specific mobile client. 
	 * @param ws Reference to the web socket server.
	 * @param message (See game message protocol.)
	 */
	public routeGameMessage(ws:any,message:string):void
	{						
		let data = message.split('|');
		
		ws.clients.forEach(function each(client:GameWebSocket) {
			if (client.uuid === data[2] && client.readyState === WebSocket.OPEN) {			
				client.send(message);
			}
		});
	}

	/**
	 * Broadcast an incoming game message to all connected mobile clients. 
	 * @param ws Reference to the web socket server.
	 * @param message (See game message protocol.)
	 */
	public broadCastGameMessage(ws:any,message:string):void
	{						
		ws.clients.forEach(function each(client:GameWebSocket) {
			if (client.uuid !== 'GAME_SCREEN' && client.readyState === WebSocket.OPEN) {			
				client.send(message);
			}
		});
	}

	/**
	 * Send a game message directly to the game screen. 
	 * @param ws Reference to the web socket server.
	 * @param message (See game message protocol.)
	 */
	public sendToGameScreen(ws:any,message:string):void
	{						
		ws.clients.forEach(function each(client:GameWebSocket) {
			if (client.uuid === 'GAME_SCREEN' && client.readyState === WebSocket.OPEN) {			
				client.send(message);
			}
		});
	}
};
