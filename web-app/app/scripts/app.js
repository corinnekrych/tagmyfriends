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

//http://stackoverflow.com/questions/14544741/angularjs-directive-to-stoppropagation
//.directive('stopEvent', function () {
//    return {
//        restrict: 'A',
//        link: function (scope, element, attr) {
//            element.bind(attr.stopEvent, function (e) {
//                e.stopPropagation();
//            });
//        }
//    };

