import express = require('express');
import { Request, Response } from 'express';
import cors from 'cors';
import WebSocket from 'ws';

import {DB} from './controller/db';
import {GameServer,GameWebSocket} from './lib/GameServer';

import busRoutes = require('./routes/bus');
import exampleRoutes = require('./routes/example');
import pollRoutes = require('./routes/poll');
import screenRoutes = require('./routes/screen');
import studyspaceRoutes = require('./routes/study-space');
import weatherRoutes = require('./routes/weather');
import leaderboardRoutes = require('./routes/leaderboard');

/* 
This is the entry point for the server application which 
manages a Restful API as well as a Websockets Server.

The server mediates communication between clients and the big screen as
well as managing data storage within a Mongo DB as well as aquiring data from 
third party sources.
*/
const app: express.Application = express();
const PORT = 3080;

/* Establish a connection to MongoDb. (By instantiating an arbitratry DB model.) */
new DB.Models.RssFeed();

/* Set headers to allows cross origin resource sharing (CORS) for the exposed REST API. */
app.use(cors());

/* Enable sending JSON for Rest API as well as parsing URL parameters. */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Register REST routes. */
app.use('/api/example', exampleRoutes);
app.use('/api/poll', pollRoutes);
app.use('/api/screen', screenRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/studyspace', studyspaceRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

/* Spin up REST Server. */
const server = app.listen(PORT, function () {
	console.log(`Express is listening on port ${PORT}`);
});

/* Configure the Websocket Server. (A reference to the web sockets server is
	 attached to the locals scope allowing the ws server to be accessible within routes.) 
*/
app.locals.ws = new WebSocket.Server({noServer:true,clientTracking:true}) as WebSocket.Server;
app.locals.game = new GameServer(app.locals.ws);
app.locals.ws.on('connection', (socket : GameWebSocket, req:Request) => {
	socket.uuid = req.url.replace('/?uuid=', '');
	console.log('new connection',socket.uuid);

	/* Identify and process incoming web socket messages. */
	socket.on('message', message => {
		let msg = message.toString();
		if(msg.startsWith('g|'))
		{
			app.locals.game.sendToGameScreen(msg,socket.uuid);
			return;
		}

		if(message.toString().startsWith('c|'))
		{
			app.locals.game.routeGameMessage(msg);
			return;
		}
		
		if(message.toString().startsWith('b|'))
		{
			app.locals.game.broadCastGameMessage(msg);
			return;
		}
	});

	/* Handle clients disconnecting. */
	socket.on('close', (code:number,reason:string) => {
		console.log('closing',socket.uuid);
		/* Notify the game that the disconnected player should be removed from the game. */
		app.locals.game.sendToGameScreen(`g|x|${socket.uuid}`,socket.uuid);	
	});
});

/* Handle request upgrade to a web socket connection. */
server.on('upgrade', (request, socket, head) => {
	app.locals.ws.handleUpgrade(request, socket, head, (socket:any) => {
		app.locals.ws.emit('connection', socket, request);
	});
});
