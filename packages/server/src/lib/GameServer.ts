import { createParameter } from 'typescript';
import WebSocket from 'ws';

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
110: Game Full
200: Collected an item


Example Message:
Notify the game that the player connect to socket uuid: WER12334PSK should move north.

g|n|WER12334PSK 

Notify the controller used by player on socket uuid WER12334PSK that the player picker up a candy.

c|v|WER12334PSK|200

Notify all game controllers that the game is over.
b|v||100

*/

export interface GameWebSocket extends WebSocket
{
	uuid:string
}

interface PlayerData {
    uuid:string,
    name:string,
    inField:boolean
}

export class GameServer
{
    static MAX_PLAYERS = 1;
	private _ws:WebSocket.Server;
	private _queue:Map<string,PlayerData>
    private _field:PlayerData[]
    private _state:"running"|"waiting"|"unknown"
    
    constructor(ws:WebSocket.Server) {
		this._ws = ws;
		this._state = "unknown";
        this._queue = new Map();
        this._field = []
    }

    get field()
    {
        return this._field;
    }

    get queue()
    {
        return this._queue;
    }

    /*
     * Place the first n player onto the field.
     */
    public putPlayersOnField()
    {
        let i = 0;
        this._field = [];
        for (let player of this._queue.values()) {
            this.addPlayerToField(player);
            if(this._field.length === GameServer.MAX_PLAYERS) break;
        }
    }

    private addPlayerToField(player:PlayerData)
    {
        player.inField = true;
        this._field.push(player);
    }

    public nextGame()
    {
        this.moveToBackOfQueue();
        for (let player of this._queue.values()) {
            player.inField = false;
        }
        this._field = [];
        this.putPlayersOnField();
    }

    /**
     * Move all players who are currently on the field. To
     * the back of the queue.
     */
    public moveToBackOfQueue()
    {
        let move:string[] = []
        
        for (let [uuid, player] of this._queue.entries()) {
            if(player.inField) move.push(uuid);
        }
        
        for(var uuid of move)
        {
            let tmp = this._queue.get(uuid);
            if(tmp)
            {
                this._queue.delete(uuid);
                this._queue.set(uuid,tmp);
            }
        }
    }

    public join(uuid:string,name:string)
    {
       /* Ensure that the state/position of a player in the queue is not changed if 
          re-connecting. */
       if(!this._queue.has(uuid))
       {
           this._queue.set(uuid,{uuid:uuid,name:name,inField:false});
           console.log('Player added to queue.');
       }

       /* The player is in game already.*/
       let player = this._queue.get(uuid);
       if(player?.inField) return;

       /* The game is currently full. */
       if(this._field.length >= GameServer.MAX_PLAYERS){
           	 console.log('Send game, full placed in queue.');
			 if(player)
			 {
				 this.sendEventToPlayer(player!,110);  
			 }  
		   return;
       }

       if(player)
       {
           this.addPlayerToField(player);
           console.log('Player added to the game.');
       }
	}
	
	public sendEventToPlayer(player:PlayerData,eventCode:number):void
	{						
		let message = 'c|v|' + player.uuid + '|' + eventCode.toString();
		GameServer.routeGameMessage(this._ws,message)
	}

    /**
	 * Re-route an incoming game message to a specific mobile client. 
	 * @param ws Reference to the web socket server.
	 * @param message (See game message protocol.)
	 */
	public static routeGameMessage(ws:any,message:string):void
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
	public static broadCastGameMessage(ws:any,message:string):void
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
	public sendToGameScreen(message:string,from:string):void
	{						
		console.log(message);
		let data = message.split('|');
        if(data[1] === 'j')
        {
            this.join(from,'todo assign playername');
        }

        if(!this._queue.has(from) || this._queue.get(from)!.inField === false)
        {
            console.log('Message blocked player not on field.')
            return;
        } 

        /* Note, in this context the client.uuid is the sending sockets uuid. */
        this._ws.clients.forEach(function each(client:WebSocket) {
            if ((client as GameWebSocket).uuid === 'GAME_SCREEN' && client.readyState === WebSocket.OPEN) {			
				client.send(message);
			}
		});
	}
}