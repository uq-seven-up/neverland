import WebSocket from 'ws';

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

	
};
