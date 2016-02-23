
var angular = require('angular');
var socket = require('socket.io-client')();
// var colors = require('./colors');
var utils = require('./utils');
var glue = require('angularjs-scroll-glue');

var app = angular.module('simpleApp', ['luegg.directives'])
  .controller('RoomController', ['$scope', '$timeout', function($scope, $timeout) {

    $scope.init = function(room) {
      $scope.room = room; // passed in from controller
      $scope.messages = [];
      $scope.model = {
        text: ''
      };
      
      $scope.user = {id: utils.randomId()};
      
      $scope.user_count = '...';
      $scope.glued = true;
      
      $scope.$watch('glued', function(newVal, oldVal) {
        if (newVal === oldVal) { return; }

        if (newVal === true) {
          // store the number for the last message they saw
          $scope.updates = false;
        }
        // console.log(oldVal,'is now',newVal);
      });

      socket.on('message:' + $scope.room, function(msg){
        // timeout cause https://stackoverflow.com/questions/30976934/socket-io-message-doesnt-update-angular-variable
        var color;
        if (msg.user.id === $scope.user.id) {
          color = 'rgba(116, 187, 255, 0.6)';
        } else {
          color = 'rgba(205, 205, 205, 0.6)';
        }

        msg.style = {'background-color': color};
        $timeout(function() {
          if (!$scope.glued) {
            $scope.updates = true;
          }
          $scope.messages.push(msg);
        });
      });

      socket.on('users:' + $scope.room, function(data){
        console.log(data);
        $timeout(function() {
          $scope.user_count = data.count;
        });
      });
      
      socket.on('connect', function() {
        console.log('connected');
        socket.emit('enter', {
          room: $scope.room,
          user: $scope.user
        });

        //   socket.on('disconnect', function() {
        //     console.log('server problems...');
        //   });
      });
    };

    $scope.scroll_to_bottom = function() {
      $scope.glued = true;
    };

    $scope.submit = function() {
      if ($scope.model.text !== '') {
        socket.emit('message', {
          message: $scope.model.text, 
          room: $scope.room,
          user: $scope.user
        });
        $scope.model.text = '';
      }
    };
  }]);
