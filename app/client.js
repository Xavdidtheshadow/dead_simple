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
// var colors = require('./colors');
var utils = require('./utils');

var app = angular.module('simpleApp', [])
  .controller('RoomController', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.init = function(room) {
      $scope.room = room;
      $scope.messages = [];
      // $scope.user = colors.color_pair();
      $scope.user = {id: utils.randomId()};
      // console.log($scope.user);
      // console.log(utils.randomId());

      socket.on('message:' + $scope.room, function(msg){
        // timeout cause https://stackoverflow.com/questions/30976934/socket-io-message-doesnt-update-angular-variable
        var color;
        if (msg.user.id === $scope.user.id) {
          color = '#22bbff';
        } else {
          color = '#cdcdcd';
        }

        msg.style = {'background-color': color};
        $timeout(function() {
          $scope.messages.push(msg);
        });
      });
    };

    $scope.submit = function() {
      socket.emit('message', {
        message: $scope.model.text, 
        room: $scope.room,
        user: $scope.user
      });
      $scope.model.text = '';
    };
  }]);
