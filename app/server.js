// basic server

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.port || 1337;

module.exports = function(){
  app.set('view engine', 'jade');

  app.get('/client.js', (req, res) => {
    res.sendFile(__dirname + '/_bundle.js');
  });

  app.get('/room/:id', (req, res) => {
    res.render('index', {room: req.params.id});
  });

  io.on('connection', (socket) => {
    socket.on('message', msg => {
      console.log('got message from', msg.room);
      io.emit(`message:${msg.room}`, {
        message: `yeah ${msg.message}`,
        user: msg.user
      });
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  http.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
};
