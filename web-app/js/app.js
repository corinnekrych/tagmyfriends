'use strict';

var tagmyfriends = angular.module('tagmyfriends', [])
  .config(['$routeProvider', function($routeProvider) {
  }]);

var friend = angular.module('friend', [])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
//        .when('/', {
//            templateUrl: 'js/views/friend-list.html',
//            controller: 'FriendCtrl'
//        })
//        .when('/friend/:friendId', {
//            templateUrl: 'js/views/friend-edit.html',
//            controller: 'FriendCtrl'
//        })
//        .when('/friend', {
//            templateUrl: 'js/views/friend-edit.html',
//            controller: 'FriendCtrl'
//        })

}]);

