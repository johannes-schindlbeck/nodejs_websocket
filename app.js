'use strict';

const e = require('express');
const express = require('express');

const app = express();
const expressWs = require('express-ws')(app);

const basicAuth = require('express-basic-auth');

var globalWs = null;
var globalResponse = "";

// Basic Auth
/**
app.use(basicAuth({
  users: { 'nimmsta ': 'NimmstaRocks!' },
})); */

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Server is running...').end();
});

// API (Post)
app.post('/api', (req, res) => {
  if (globalWs) {
    console.log("Sending... " + JSON.stringify(req.body));
    globalResponse = "";
    globalWs.send(JSON.stringify(req.body));

    var timeout = 0;
    while (globalResponse == "" && timeout < 300) {
      require('deasync').sleep(100);
      timeout++;
    }
    if (globalResponse == "") {
      res.status(500).json({ error: 'Timeout' });
    } else {
      res.status(200).send(globalResponse).end();
    }
  } else {
    res.status(500).json({ error: 'No websocket connection' });
  }
});

// API (Response via Websocket)
app.ws('/wsapi', function (ws, req) {
  globalWs = ws;
  ws.on('message', function (msg) {
    console.log(msg);
    globalResponse = msg;
  });
  console.log('Client registered for wsapi');
});

// Websocket Echo
app.ws('/echo', function (ws, req) {
  ws.on('message', function (msg) {
    console.log(msg);
    ws.send(msg);
  });
  console.log('Client registered for Echo');
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


module.exports = app;