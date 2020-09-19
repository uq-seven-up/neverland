var Ship = function(id,heading,surface) {
	this.id = id;
	this.heading = heading;
	this.surface = surface;
	this._undo.heading = heading; 
	this._undo.surface = this._clone(this.surface);
};

Ship.prototype = {
	id:'',
	heading:'N',
	surface:[],
	_undo:{
		heading:'',
		surface:[]
	},
	forward:function(distance){
		this.push(this.heading,distance)
	},

	undo:function(){
		this.heading = this._undo.heading;
		this.surface = this._clone(this._undo.surface);
	},

	turn:function(direction){
		let angle = direction === "left" ? -90 : 90;
		
		switch(this.heading)
		{
			case 'N':
				this.heading = direction === "left" ? 'W' : 'E';
				break;
			case 'E':
				this.heading = direction === "left" ? 'N' : 'S';
				break;
			case 'S':
				this.heading = direction === "left" ? 'E' : 'W';
				break;
			case 'W':
				this.heading = direction === "left" ? 'S' : 'N';
				break;
		}
		this._rotate(angle)
	},

	push:function(direction,distance){
		let x,y;
		switch(direction)
		{
			case 'N':
				y = distance * -1;
				x = 0;
				break;
			case 'E':
				y = 0;
				x = distance;
				break;
			case 'S':
				y = distance;
				x = 0;
				break;
			case 'W':
				y = 0;
				x = distance * -1;
				break;
		}
		this._undo.surface = this._clone(this.surface);
		for(const i in this.surface){			
			this.surface[i].x += x;
			this.surface[i].y += y;
		}
	},

	_clone:function(src){
		return JSON.parse(JSON.stringify(src));	
	},

	_rotate:function(angle){
		this._undo.heading = this.heading;
		this._undo.surface = this._clone(this.surface);

		for(const i in this.surface){			
			let tuple = this._rotatePoint(this.surface[0].x,this.surface[0].y, this.surface[i].x, this.surface[i].y, angle);				
			this.surface[i].x = Math.round(tuple.x);
			this.surface[i].y = Math.round(tuple.y);		
		}
	},

	/* Code based on: https://jsfiddle.net/skibulk/uhs4e04v/ */
	_rotatePoint:function(centerx, centery, x, y, angle) {
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
};


var model = {
	COLS:30,
	ROWS:30,
	ships:[
		new Ship('1234','W',[{x:5,y:5,s:3},{x:4,y:5,s:3},{x:6,y:5,s:3},{x:5,y:6,s:3}]),
		new Ship('5678','S',[{x:9,y:1,s:3},{x:9,y:0,s:3},{x:9,y:2,s:3}])
	],
	tiles:[],
	getActiveShip:function()
	{
		let shipId;
		let radio = document.getElementsByName('shipId');		
		for (var i = 0, length = radio.length; i < length; i++) {
			if (radio[i].checked) {
				shipId = radio[i].value;
			  	break;
			}
		}
		for(const i in model.ships){
			if(model.ships[i].id === shipId) return model.ships[i];
		}

		return null;
	}
};

var view = {
	init:function(){
		let table = document.createElement("table");
		for(var row = 0; row < model.ROWS; row++){
			let tr = document.createElement("tr")
			for(var col = 0; col < model.COLS; col++){
				let td = document.createElement("td");				
				td.setAttribute('id','grid_' + col + '_' + row);
				td.innerText = '' + col + ',' + row;
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		let root = document.getElementById('root');
		root.appendChild(table);
		view.refresh();
	},

	refresh:function(){
		view.clear();
		view.renderTiles();
		view.renderShips();
	},

	renderShips:function(){
		for(const i in model.ships){
			let ship = model.ships[i];
			for(const j in ship.surface){			
				let surface = ship.surface[j];
				let id = 'grid_' + surface.x + '_' + surface.y;
				let td = document.getElementById(id);
				if(td)
				{
					if(j==0)
					{
						switch(surface.s)
						{
							case 3:
								td.style.backgroundColor = 'gray';
								break;
							default:
								td.style.backgroundColor = 'black';
								break;
						}												
					}else
					{
						switch(surface.s)
						{
							case 3:
								td.style.backgroundColor = 'blue';
								break;
							default:
								td.style.backgroundColor = 'red';
								break;
						}
					}
				}
			}
		}
	},

	renderTiles:function(){
		for(const i in model.tiles){
			let tile = model.tiles[i];									
			let id = 'grid_' + tile.x + '_' + tile.y;
			let td = document.getElementById(id);
			if(td)
			{				
				switch(tile.type)
				{
					case 'miss':
						td.style.backgroundColor = 'cyan';
						break;
				}
			}
		}
	},

	clear:function(){
		for(let x = 0; x < model.COLS; x++)
		{
			for(let y = 0; y < model.ROWS; y++)
			{
				let id = 'grid_' + x + '_' + y;
				let td = document.getElementById(id);
				td.style.backgroundColor = 'white';
			}
		}
	}
};

var controller = {
	init:function(){
		view.init();		
	},

	fire:function(){				
		let x = parseInt(document.getElementById('fire_x').value,10);
		let y = parseInt(document.getElementById('fire_y').value,10);
		let hit = false;

		for(const i in model.ships){
			let ship = model.ships[i];
			for(const j in ship.surface){
				let surface = ship.surface[j];
				if(surface.x === x && surface.y === y){
					hit = true;
					surface.s = 0;
				} 
			}
		}
		
		if(!hit) model.tiles.push({type:'miss',x:x,y:y})
		
		view.refresh();
	},

	turn:function(direction){
		let ship = model.getActiveShip();
		if(ship === null) return;
		
		ship.turn(direction);
		controller._process(ship);
	},

	forward:function(distance){
		let ship = model.getActiveShip();
		if(ship === null) return;
		
		ship.forward(distance);
		controller._process(ship);		
	},

	push:function(direction,distance){
		let ship = model.getActiveShip();
		if(ship === null) return;
		
		ship.push(direction,distance);					
		controller._process(ship);
	},

	_process:function(ship)
	{
		if(!controller.isValidPosition(ship,model.tiles))
		{
			ship.undo();
			alert('Invalid move. The ship must not leave the battle zone');
		} 


		let shipB = controller.collissionDetection(ship);
		if(shipB)
		{
			ship.undo();
			let text = "Ship " + ship.id + " ran into ship " + shipB.id;
			alert(text);
		}		
		view.refresh();
	},

	isValidPosition:function(ship,){
		/* validate that the full ship is contained inside of the map. */
		for(let i in ship.surface)
		{
			let surface = ship.surface[i];
			if(surface.x < 0 || surface.x >= model.COLS) return false
			if(surface.y < 0 || surface.y >= model.ROWS) return false
		}
				
		return true;
	},

	collissionDetection:function(ship){			
		for(let i in model.ships)
		{ 
			let ship_b = model.ships[i];
			if(ship_b.id === ship.id) continue; // Ensure a ship does not collide with itself.
			for(let j in ship_b.surface)
			{
				let surface_b = ship_b.surface[j];
				for(let k in ship.surface)
				{
					let surface = ship.surface[k];
					if(surface.x === surface_b.x && surface.y === surface_b.y) return ship_b;
				}
			}			
		}

		return null;
	}
};

controller.init();
