const express = require('express');
const app = express();

app.get('/hello', (req, res) => {
	console.log('light up stuff');
	res.send({message:'OK'});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));