'use strict';

friend.controller('FriendCtrl', function ($scope, $http, friend) {
    $scope.friend = friend;
    $scope.friends = {};
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http.get('http://localhost:8080/tagmyfriends/friend/list').success(function(data) {
        for (var i = 0; i < data.length; i++) {
            var element = data[i];
            $scope.friends[element.id] = element;
        }
    });

    var createElement = function () {
        resetForm('form-update-friend');
        $scope.friend = {};
        $.mobile.changePage($('#section-show-friend'));
        $('#delete-friend').css('display', 'none');
    };

    var resetForm = function (form) {
        $('input[data-type="date"]').each(function () {
            $(this).scroller('destroy').scroller({
                preset:'date',
                theme:'default',
                display:'modal',
                mode:'scroller',
                dateOrder:'mmD ddyy'
            });
        });
    };

    $scope.addFriend = function (event) {
        event.stopPropagation();
        //$('#form-update-friend').validationEngine('hide');
        //$('#form-update-friend').validationEngine({promptPosition:'bottomLeft'});
        createElement();
    };

    $scope.create = function (event) {
        event.stopPropagation();
        $scope.friend.registrationDate = $('#input-friend-registrationDate').scroller('getDate', true);
        var toJson = {friend:JSON.stringify($scope.friend)};
        toJson = $.param(toJson);
        $http.post("http://localhost:8080/tagmyfriends/friend/save", toJson)
            .success(function(item, status, headers, config) {
                if (item.errors || item.message) {
                    return false;
                }
                $scope.friends[item.id] = item;
                //TODO remove
                $.mobile.changePage($('#section-list-friend'));
            }).error(function(item, status, headers, config) {


            });
    };

    $scope.$on('$includeContentLoaded', function () {
        $('#section-list-friend').trigger("create");
    });
});
