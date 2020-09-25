import WebSocket from 'ws';
import {GameMap,CompassHeading} from '@7up/common-types';
import {Ship} from '@7up/common-utils';

export class Game 
{
	public screen_socket_id:string;
	constructor() {
		this.screen_socket_id = '';
	}

	readonly ROWS = 10;
	readonly COLS = 10

	private _players = 0;
	private _ships:Ship[] = [];

	get gameMap():GameMap {
		let _gameMap = new Map() as GameMap;
		
		for(let ship of this._ships)
		{	
			for(let surface of ship.surface)
			{
				let id = 'g_' + surface.x + '_' + surface.y; 
				_gameMap.set(id,{id:id,x:surface.x,y:surface.y,class:'tile_ship'});
			}
		}		
		
		return _gameMap
	}

	public reset():void
	{
		this._players = 0;
		this._ships=[];
	}

	public addPlayer(guid:string)
	{
		this._players++;
		this._ships.push(new Ship(guid,CompassHeading.North,this._players,5))		
	}

	public removePlayer(guid:string)
	{
		this._players--;
		let i = 0;
		for(let ship of this._ships)
		{
			if(ship.id === guid){
				break;				
			}
			i++;
		}
		this._ships.splice(i,1);
	}

	public turnShip(shipId:string,direction:'left'|'right'){
		let ship = this.getShip(shipId);
		if(ship === null) return
		
		ship.turn(direction);
		this.validateShipMovement(ship);
	}

	public driveShip(shipId:string){
		let ship = this.getShip(shipId);
		if(ship === null) return
		
		const distance = 1;		
		ship.drive(distance);
		this.validateShipMovement(ship);		
	}


	public moveShip(shipId:string,heading:CompassHeading,distance:number):void
	{
		let ship = this.getShip(shipId);
		if(ship === null) return

		ship.move(heading,distance);
		this.validateShipMovement(ship);		
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


	public broadCastGameMap(ws:any):any
	{
		let mapObject:any = {};  
		this.gameMap.forEach((value, key) => {  
			mapObject[key] = value
		}); 

		let data = {gameMap:mapObject}
		
		ws.clients.forEach(function each(client:any) {
			if (client.readyState === WebSocket.OPEN) {			
				client.send(JSON.stringify(data));
			}
		});

		return data;
	}

	public sendGameMap(uuid:string,ws:any):any
	{
		let mapObject:any = {};  
		this.gameMap.forEach((value, key) => {  
			mapObject[key] = value
		}); 

		let data = {gameMap:mapObject}
		
		ws.clients.forEach(function each(client:any) {
			if (client.readyState === WebSocket.OPEN && client.uuid === uuid) {			
				client.send(JSON.stringify(data));
				return;
			}
		});
	}

	private getShip(shipId:string):Ship | null
	{
		for(let ship of this._ships)
		{
			if(ship.id === shipId){
				return ship				
			}
		}
		
		return null;
	}

	private validateShipMovement(ship:Ship)
	{
		if(!this.isValidShipPosition(ship))
		{
			ship.undo();
			console.log('Invalid move. The ship must not leave the battle zone');
		} 

		let shipB = this.collissionDetection(ship);
		if(shipB)
		{
			ship.undo();
			let text = "Ship " + ship.id + " ran into ship " + shipB.id;
			console.log(text);
		}
	}

	private isValidShipPosition(ship:Ship){
		/* validate that the full ship is contained inside of the map. */
		for(let surface of ship.surface)
		{
			if(surface.x < 0 || surface.x >= this.COLS) return false
			if(surface.y < 0 || surface.y >= this.ROWS) return false
		}
				
		return true;
	}

	private collissionDetection(ship:Ship):Ship|null{			
		for(let ship_b of this._ships)
		{ 
			if(ship_b.id === ship.id) continue; // Ensure a ship does not collide with itself.
			for(let surface_b of ship_b.surface)
			{
				for(let surface of ship.surface)
				{
					if(surface.x === surface_b.x && surface.y === surface_b.y) return ship_b;
				}
			}			
		}

		return null;
	}
};