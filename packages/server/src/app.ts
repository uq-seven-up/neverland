import express = require('express');
import {Request,Response } from "express";
import exampleRoutes = require('./routes/example');
import pollRoutes = require('./routes/poll');
import screenRoutes = require('./routes/screen');
import {DB} from './controller/db';

const app: express.Application = express();
const PORT = 3080;

/* Establish a connection to mongodb on server start,*/
new DB.Models.RssFeed;

app.all('*', function(req:Request, res:Response, next:any) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/example',exampleRoutes);
app.use('/api/poll',pollRoutes);
app.use('/api/screen',screenRoutes);

app.listen(PORT,function(){
	console.log(`Express is listening on port ${PORT}`);
});