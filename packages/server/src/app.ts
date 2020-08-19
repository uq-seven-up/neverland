import express = require('express');
import screenRouter = require('./routes/screen');

const app: express.Application = express();
const PORT = 3080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/screen',screenRouter);

app.listen(PORT,function(){
	console.log(`Express is listening on port ${PORT}`);
});