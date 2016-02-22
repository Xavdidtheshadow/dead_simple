
var angular = require('angular');
var socket = require('socket.io-client')();
// var colors = require('./colors');
var utils = require('./utils');
var glue = require('angularjs-scroll-glue');

var app = angular.module('simpleApp', ['luegg.directives'])
  .controller('RoomController', ['$scope', '$timeout', '$anchorScroll', function($scope, $timeout, $anchorScroll) {

    $scope.init = function(room) {
      $scope.room = room; // passed in from controller
      $scope.messages = [];
      $scope.model = {
        text: '' // init to string so we can submit empty box
      };
      
      $scope.user = {id: utils.randomId()};
      
      // $scope.user_count = 1;
      $scope.glued = true;
      $scope.glued_to = 0;

      $scope.message_count = 0;
      
      $scope.$watch('glued', function(newVal, oldVal) {
        if (newVal === oldVal) { return; }

        if (newVal === false) {
          // store the number for the last message they saw
          $scope.glued_to = $scope.message_count;
        }
        // console.log(oldVal,'is now',newVal);
      });

      // socket.on('connect', function() {
      //   console.log('connected');
      //   socket.emit('enter', {
      //     room: $scope.room
      //   });

      //   socket.on('disconnect', function() {
      //     console.log('server problems...');
      //   });
      // });

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
          $scope.message_count += 1;
          $scope.messages.push(msg);
        });
      });

      // socket.on('users:' + $scope.room, function(data){
      //   console.log(data);
      //   $timeout(function() {
      //     $scope.user_count = data.count;
      //   });
      // });
    };

    $scope.scroll_to_bottom = function() {
      $anchorScroll('bottom');
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
