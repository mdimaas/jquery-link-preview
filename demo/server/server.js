var express = require('express');
var syncRequest = require('sync-request');
var app = express();

var port = 3000;

app.use("/app", express.static('public'));

app.get('/urlData', function (req, res) {
	res.send(syncRequest('GET', req.query.get).getBody());
});

app.listen(port);

console.log("Demo server started on port = " + port);