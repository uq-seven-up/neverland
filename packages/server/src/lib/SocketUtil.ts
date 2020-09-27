import WebSocket from 'ws';

export class SocketUtil 
{
	public screen_socket_id:string;
	constructor() {
		this.screen_socket_id = '';
	}

	public broadCast(ws:any,data:any):void
	{					
		ws.clients.forEach(function each(client:any) {
			if (client.readyState === WebSocket.OPEN) {			
				client.send(JSON.stringify(data));
			}
		});
	}

	public sendToScreen(ws:any,data:string):void
	{	
						
		ws.clients.forEach(function each(client:any) {
			if (client.uuid === 'GAME_SCREEN' && client.readyState === WebSocket.OPEN) {			
				client.send(data);
			}
		});
	}
};
