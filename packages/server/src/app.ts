import express = require('express');
import screenRouter = require('./routes/screen');

const app: express.Application = express();
const PORT = 3080;

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