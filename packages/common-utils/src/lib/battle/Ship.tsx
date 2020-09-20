import {CompassHeading} from '@7up/common-types';

type ShipSurface =
{
	x:number,
	y:number,
	s:number
}

export class Ship 
{
	constructor(id:string,heading:CompassHeading,col:number,row:number) {
		this._id = id;
		this._heading = heading;
		this._surface.push({x:col,y:row+1,s:1});
		this._surface.push({x:col,y:row+0,s:1});
		this._surface.push({x:col,y:row+2,s:1});
	}
	
	private _id:string = '';
    private _heading:CompassHeading = CompassHeading.North;    
    private _undo_heading:CompassHeading = CompassHeading.North;
	private _surface:ShipSurface[] = [];
	private _undo_surface:ShipSurface[] = [];
	
	get id():string {return this._id}
    set id(value:string){this._id = value}
	get heading():CompassHeading {return this._heading}
	set heading(value:CompassHeading){this._heading = value}
	get surface():ShipSurface[] {return this._surface}

	public isDead(){		
		for(const i in this._surface){			
			if(this._surface[i].s > 0) return false;
		}
		return true;
	}

	public forward(distance:number):void{
		this.push(this._heading,distance)
	}

	public undo():void{
		this._heading = this._undo_heading;
		this._surface = this._clone(this._undo_surface);
	}

	public turn (direction:string):void{
		let angle = direction === "left" ? -90 : 90;
		
		switch(this._heading)
		{
			case CompassHeading.North:
				this._heading = direction === "left" ? CompassHeading.West : CompassHeading.East;
				break;
			case CompassHeading.East:
				this._heading = direction === "left" ? CompassHeading.North : CompassHeading.South;
				break;
			case CompassHeading.South:
				this._heading = direction === "left" ? CompassHeading.East : CompassHeading.West;
				break;
			case CompassHeading.West:
				this._heading = direction === "left" ? CompassHeading.South : CompassHeading.North;
				break;
		}
		this._rotate(angle)
	}

	public push(direction:CompassHeading,distance:number):void{
		let x,y;
		switch(direction)
		{
			case CompassHeading.North:
				y = distance * -1;
				x = 0;
				break;
			case CompassHeading.East:
				y = 0;
				x = distance;
				break;
			case CompassHeading.South:
				y = distance;
				x = 0;
				break;
			case CompassHeading.West:
				y = 0;
				x = distance * -1;
				break;
		}
		this._undo_surface = this._clone(this._surface);
		for(const i in this._surface){			
			this._surface[i].x += x;
			this._surface[i].y += y;
		}
	}

	private _clone(src){
		return JSON.parse(JSON.stringify(src));	
	}

	private _rotate(angle){
		this._undo_heading = this.heading;
		this._undo_surface = this._clone(this._surface);

		for(const i in this._surface){			
			let tuple = this._rotatePoint(this._surface[0].x,this._surface[0].y, this._surface[i].x, this._surface[i].y, angle);				
			this._surface[i].x = Math.round(tuple.x);
			this._surface[i].y = Math.round(tuple.y);		
		}
	}

	/* Code based on: https://jsfiddle.net/skibulk/uhs4e04v/ */
	private _rotatePoint(centerx, centery, x, y, angle) {
		let radian = (Math.PI / 180) * angle;
		let cos = Math.cos(radian);
		let sin = Math.sin(radian);
		let run = x - centerx;
		let rise = y - centery; 		  
		return {
		  x: (cos * run) + (sin * rise) + centerx,
		  y: (cos * rise) - (sin * run) + centery
		};
	  }
}