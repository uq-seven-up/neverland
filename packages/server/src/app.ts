import express = require('express');
import screenRouter = require('./routes/screen');
import {DB} from './controller/db';

const app: express.Application = express();
const PORT = 3080;

/* Establish a connection to mongodb on server start,*/
new DB.Models.RssFeed;

app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type,authorization');
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/screen',screenRouter);

app.listen(PORT,function(){
	console.log(`Express is listening on port ${PORT}`);
});