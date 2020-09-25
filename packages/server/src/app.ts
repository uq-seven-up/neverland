import express = require('express');
import { Request, Response } from 'express';
import cors from 'cors';
import WebSocket from 'ws';

import {DB} from './controller/db';
import busRoutes = require('./routes/bus');
import exampleRoutes = require('./routes/example');
import gameRoutes = require('./routes/game');
import pollRoutes = require('./routes/poll');
import screenRoutes = require('./routes/screen');
import StudySpaceRoutes = require('./routes/study-space');
import weatherRoutes = require('./routes/weather');
import {CompassHeading} from '@7up/common-types';

import {Game} from './lib/Game';

const app: express.Application = express();
const PORT = 3080;

interface GameWebSocket extends WebSocket
{
	uuid:string
}

/* Establish a connection to MongoDb. (By instantiating an arbitratry DB model.) */
new DB.Models.RssFeed();

app.locals.game = new Game();

/* Set headers to allows cross origin resource sharing (CORS) for the exposed REST API. */
//app.all('*', function (req: Request, res: Response, next: any) {
//	res.header('Access-Control-Allow-Origin', '*');
//	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//	res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');
//	next();
//});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* Register REST routes. */
app.use('/api/example', exampleRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/poll', pollRoutes);
app.use('/api/screen', screenRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/studyspace', StudySpaceRoutes);
app.use('/api/weather', weatherRoutes);

const server = app.listen(PORT, function () {
	console.log(`Express is listening on port ${PORT}`);
});



/* Configure websocket server. (attached to local scope, to make the ws serve accessible within routes.) */
app.locals.ws = new WebSocket.Server({noServer:true,clientTracking:true}) as WebSocket.Server;
app.locals.ws.on('connection', (socket : GameWebSocket, req:Request) => {
	socket.uuid = req.url.replace('/?uuid=', '');
	console.log(socket.uuid)
	
	if(socket.uuid !== '' && socket.uuid !== 'POLL_WIDGET' && socket.uuid !== 'GAME_SCREEN')
	{
		console.log('adding player',socket.uuid);
		app.locals.game.addPlayer(socket.uuid);
		
	}
	app.locals.game.broadCastGameMap(app.locals.ws);
	
	socket.on('close', (code:number,reason:string) => {
		console.log('Closing',socket.uuid);
		app.locals.game.sendToScreen(app.locals.ws,`g|x|${socket.uuid}`);	
	});

	socket.on('message', message => {
		/* Route game controller messages directly to the screen. */
		if(message.toString().startsWith('g|'))
		{
			app.locals.game.sendToScreen(app.locals.ws,message);
			return;
		}
		
		const data = JSON.parse(message.toString());
				
		if(data.widget)
		{
			switch(data.widget)
			{
				case 'game':
					let shipId = socket.uuid;
					switch(data.action)
					{
						case 'old_move':
							let heading = CompassHeading.North
							switch(data.heading)
							{
								case 'N':
									heading = CompassHeading.North
									break;
								case 'E':
									heading = CompassHeading.East
									break;
								case 'S':
									heading = CompassHeading.South
									break;
								case 'W':
									heading = CompassHeading.West
									break;
							}
							app.locals.game.moveShip(shipId,heading,1);
							app.locals.game.broadCastGameMap(app.locals.ws);							
							break;
						case 'turn':
							let direction = data.direction === 'left' ? 'left' : 'right';							
							app.locals.game.turnShip(shipId,direction);
							app.locals.game.broadCastGameMap(app.locals.ws);							
							break;
						case 'drive':
							app.locals.game.driveShip(shipId);
							app.locals.game.broadCastGameMap(app.locals.ws);							
							break;
						case 'join':
							app.locals.game.broadCast(app.locals.ws,{type:'game',action:'add_player',player:data.player});
							break;
						case 'move':
							app.locals.game.broadCast(app.locals.ws,{type:'game',action:'move',player:data.player});
							break;
						default:
							console.log(message);
					}
					break;
				default:
					console.log(message);
			}
		}				
	});
});

server.on('upgrade', (request, socket, head) => {
	app.locals.ws.handleUpgrade(request, socket, head, (socket:any) => {
		app.locals.ws.emit('connection', socket, request);
	});
});
