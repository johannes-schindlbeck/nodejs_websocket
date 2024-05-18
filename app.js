'use strict';

const express = require('express');

const app = express();
var expressWs = require('express-ws')(app);

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

// Websocket
app.ws('/echo', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
    ws.send(msg);
  });
  console.log('socket', req.testing);
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


module.exports = app;