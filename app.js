'use strict';

const express = require('express');

const app = express();
const expressWs = require('express-ws')(app);

const basicAuth = require('express-basic-auth');

var globalWs = null;

// Basic Auth
/**
app.use(basicAuth({
  users: { 'nimmsta ': 'NimmstaRocks!' },
})); */

app.use(express.json());

app.get('/', (req, res) => {
  if (globalWs) {
    globalWs.send('Hello, world!');
  }
  res.status(200).send('Hello, world!').end();
});

// API (Post)
app.post('/api', (req, res) => {
  if (globalWs) {
    console.log("Sending... " + JSON.stringify(req.body));
    globalWs.send(JSON.stringify(req.body));
  }
  res.json(req.body);
});

// Websocket
app.ws('/echo', function (ws, req) {
  globalWs = ws;
  ws.on('message', function (msg) {
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