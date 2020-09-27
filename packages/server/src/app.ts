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


import {SocketUtil,GameWebSocket} from './lib/SocketUtil';

const app: express.Application = express();
const PORT = 3080;



/* Establish a connection to MongoDb. (By instantiating an arbitratry DB model.) */
new DB.Models.RssFeed();

app.locals.socketUtil = new SocketUtil();

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
	console.log('new connection',req.url,socket.uuid)

	socket.on('message', message => {
		/* Route game controller messages directly to the screen. */
		if(message.toString().startsWith('g|'))
		{
			app.locals.socketUtil.sendToGameScreen(app.locals.ws,message);
			return;
		}
		if(message.toString().startsWith('c|'))
		{
			app.locals.socketUtil.routeGameMessage(app.locals.ws,message);
			return;
		}
		if(message.toString().startsWith('b|'))
		{
			app.locals.socketUtil.broadCastGameMessage(app.locals.ws,message);
			return;
		}								
	});

	socket.on('close', (code:number,reason:string) => {
		console.log('Closing',socket.uuid);
		app.locals.socketUtil.sendToScreen(app.locals.ws,`g|x|${socket.uuid}`);	
	});
});

server.on('upgrade', (request, socket, head) => {
	app.locals.ws.handleUpgrade(request, socket, head, (socket:any) => {
		app.locals.ws.emit('connection', socket, request);
	});
});
