interface PlayerData {
    uuid:string,
    name:string,
    inField:boolean
}

export class GameServer
{
    static MAX_PLAYERS = 4
    private _count:number
    private _queue:Map<string,PlayerData>
    private _field:PlayerData[]
    private _state:"running"|"waiting"|"unknown"
    
    constructor() {
        this._count = 0;
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
            player.inField = true;
            this._field.push(player);
            if(this._field.length === GameServer.MAX_PLAYERS) break;
        }
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
       
       if(!this._queue.has(uuid))
       {
           this._queue.set(uuid,{uuid:uuid,name:name,inField:false})
           this._count++;
       }

       let playerData = this._queue.get(uuid);
       if(playerData?.inField) return;

       if(this._field.length === GameServer.MAX_PLAYERS){
           console.log('Send game, full placed in queue.');
           return;
       }

       if(this._state === 'running'){
        console.log('Game in progress, please wait.');
        return;
       }

       this._field

        
        // Is spot ready or reconnecting?
        // start routing messages.
        // is game waiting
        //    sen
        // else
        // send queued message

    }
}