import express = require('express');

const router = express.Router();

router.get('/test:id',(req:any,res:any) => {
	const {id} = req.params;
	res.send({id})
});

router.get('/test',(req:any,res:any) => {
	res.send('{message:"Hello World"}')
});

router.post('/test',(req:any,res:any) => {
	// Echo back the response body.
	res.send(req.body)
});

export = router;