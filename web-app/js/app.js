'use strict';

var tagmyfriends = angular.module('tagmyfriends', [])
  .config(['$routeProvider', function($routeProvider) {
//    $routeProvider
//      .when('/', {
//        templateUrl: 'app/views/main.html',
//       controller: 'MainCtrl'
//      })
  }]);

var friend = angular.module('friend', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
//    $routeProvider
//        .when('/', {
//            templateUrl: 'app/views/friend.html',
//            controller: 'FriendCtrl'
//        })
}]);

