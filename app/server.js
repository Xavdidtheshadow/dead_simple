// basic server

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var counter = require('./counter');

var port = process.env.PORT || 1337;

module.exports = function() {
  var room_counts = {};

  app.set('view engine', 'jade');

  app.get('/client.js', (req, res) => {
    res.sendFile(__dirname + '/_bundle.js');
  });

  app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/_the.css');
  });

  app.get('/', (req, res) => {
    res.render('index');
  });  

  app.get('/room/:id', (req, res) => {
    res.render('room', {room: req.params.id});
  });

  io.on('connection', (socket) => {    
    socket.on('enter', data => {
      console.log('user', data.user.id,'connected to', data.room);
      socket.info = data;
      var c = counter.incr(socket.info.room);
      // console.log(c);
      io.emit(`users:${socket.info.room}`, {count: c});
    });

    socket.on('message', msg => {
      io.emit(`message:${msg.room}`, {
        message: msg.message,
        user: msg.user
        // room_count: counter.count(msg.room) // could resent for reconnects
      });
    });

    socket.on('disconnect', () => {
      if (socket.info) {
        // sometimes this info isn't here? 
        console.log('user', socket.info.user.id,'disconnected from', socket.info.room);
        var c = counter.decr(socket.info.room);
        // console.log(c);
        io.emit(`users:${socket.info.room}`, {count: c});
      }
    });
  });

  http.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
};
