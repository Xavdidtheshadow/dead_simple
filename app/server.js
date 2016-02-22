// basic server

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// var counter = require('./counter');

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
    // socket.on('enter', data => {
    //   console.log('user connected to', data.room);
    //   var c = counter.incr(data.room);
    //   console.log(c, counter.count(data.room));
    //   socket.emit(`users:${data.room}`, {count: c});
    // });

    // socket.on('exit', data => {
    //   console.log('user disconnected from', data.room);
    //   var c = counter.decr(data.room);
    //   console.log(c, counter.count(data.room));
    //   socket.emit(`users:${data.room}`, {count: c});
    // });

    socket.on('message', msg => {
      console.log('got message from', msg.room);
      io.emit(`message:${msg.room}`, {
        message: msg.message,
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
