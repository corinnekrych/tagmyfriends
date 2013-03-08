'use strict';

friend.controller('FriendCtrl', function ($scope, $http, friends, $) {
    //$scope.friend = friend;
    $scope.friends = friends;
    $scope.currentId = 0;
    $scope.actionButton = "ADD";

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    $scope.init = function () {
        $http.get('http://localhost:8080/tagmyfriends/friend/list').success(function (data) {
            for (var i = 0; i < data.length; i++) {
                var element = data[i];
                if (element) {
                    $scope.friends[element.id] = element;
                }

            }
        });
    };

    $scope.init();

    $scope.dispatch = function (event) {
        if (event) {
            event.stopPropagation();
        }
        if ($scope.actionButton == 'ADD') {
            addItem();
        } else if ($scope.actionButton == 'UPDATE') {
            updateItem();
        } else if ($scope.actionButton == 'CREATE') {
            createItem();
        }

    };

    $scope.gotoList = function(event) {
        if(event) {
           event.stopPropagation();
        }
        $scope.actionButton = "ADD";
        delete $scope.friends[0];
        $scope.currentId = 0;
        $.mobile.changePage($('#section-list-friend'));
    };

    //------------ Update item -----------------
    $scope.clicked = function (val) {
        $scope.currentId = val;
        $scope.actionButton = "UPDATE";
    };

    var updateItem = function () {
        //TODO remove view specific code to directive
        if ($('#input-friend-registrationDate')) {
          $scope.friends[$scope.currentId].registrationDate =  $('#input-friend-registrationDate').scroller('getDate', true);
        }
        var toJson = {friend:JSON.stringify($scope.friends[$scope.currentId])};
        toJson = $.param(toJson);
        $http.post("http://localhost:8080/tagmyfriends/friend/update", toJson)
            .success(function (item, status, headers, config) {
                if (item.errors || item.message) {
                    return false;
                }
                $scope.gotoList();
                $.mobile.changePage($('#section-list-friend'));
            }).error(function (item, status, headers, config) {
                //var eltOnError = item;

            });
    };
    //------------ End update item -----------------

    //------------ Add new item -----------------
    var addItem = function () {
        $scope.friends[0] = {firstname:''};
        $.mobile.changePage($('#section-show-friend'));
        $scope.actionButton = "CREATE";
    };

    var createItem = function () {
        //TODO remove view specific code to directive
        if ($('#input-friend-registrationDate')) {
            $scope.friends[$scope.currentId].registrationDate =  $('#input-friend-registrationDate').scroller('getDate', true);
        }
        var toJson = {friend:JSON.stringify($scope.friends[0])};
        toJson = $.param(toJson);
        $http.post("http://localhost:8080/tagmyfriends/friend/save", toJson)
            .success(function (item, status, headers, config) {
                if (item.errors || item.message) {
                    return false;
                }
                $scope.friends[item.id] = item;
                delete $scope.friends[0];
                $scope.gotoList();
            }).error(function (item, status, headers, config) {


            });
    };
    //------------ End add new item -----------------

    //------------ Delete item -----------------
    $scope.delete = function (event) {
        if (event) {
            event.stopPropagation();
        }
        deleteItem();
    };

    var deleteItem = function () {
        var toJson = {id:$scope.currentId};
        toJson = $.param(toJson);
        $http.post("http://localhost:8080/tagmyfriends/friend/delete", toJson)
            .success(function (item, status, headers, config) {
                if (item.errors || item.message) {
                    return false;
                }
                delete $scope.friends[$scope.currentId]
                $scope.gotoList();
            }).error(function (item, status, headers, config) {


            });
    };
    //------------ Delete item -----------------
});
