// simple client

// var socket = io();
// var id = 0;

// $('form').submit(function(){
//   id += 1;
//   socket.emit('message', {message: $('#m').val(), room: '#{room}'});
//   $('#m').val('');
//   return false;
// });

// socket.on('message:#{room}', function(msg){
//   $('.messages').append($('<li>').text(msg.message));
// });

var angular = require('angular');
var socket = require('socket.io-client')();
var colors = require('./colors');

var app = angular.module('simpleApp', [])
  .controller('RoomController', ['$scope', '$timeout', function($scope, $timeout) {
    console.log(colors);
    $scope.init = function(room) {
      $scope.room = room;
      $scope.messages = [];
      $scope.color = colors.random_color();

      socket.on('message:' + $scope.room, function(msg){
        // timeout cause https://stackoverflow.com/questions/30976934/socket-io-message-doesnt-update-angular-variable
        $timeout(function() {
          $scope.messages.push(msg.message);
        });
      });
    };

    $scope.submit = function() {
      socket.emit('message', {message: $scope.model.text, room: $scope.room});
      $scope.model.text = '';
    };
  }]);