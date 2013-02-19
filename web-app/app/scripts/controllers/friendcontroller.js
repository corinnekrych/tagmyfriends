'use strict';

friend.controller('FriendCtrl', function ($scope, $http, friend) {
    $scope.friend = friend;
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    var createElement = function () {
        resetForm('form-update-friend');
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
        var div = $("#" + form);
        div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
        div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    };

    $scope.addFriend = function (item) {
        //event.stopPropagation();
        //$('#form-update-friend').validationEngine('hide');
        //$('#form-update-friend').validationEngine({promptPosition:'bottomLeft'});
        createElement();
    };

    $scope.create = function () {
        var foo = $scope.friend.firstname;
        var friendMock = {version: "", class: "friend", id: "", lastname: "krych", firstname: "corinne", registrationDate: "2013-02-16T11:00:00.000Z"};
        //var toJson = JSON.stringify(friendMock);
        var toJson = {friend:JSON.stringify($scope.friend)};
        toJson = $.param(toJson);
        $http.post("http://localhost:8080/tagmyfriends/friend/save", toJson)
            .success(function(data, status, headers, config) {
                $scope.data = data;
            }).error(function(data, status, headers, config) {
                $scope.status = status;
            });
    };

    $scope.$on('$includeContentLoaded', function () {
        $('#section-list-friend').trigger("create");
    });
});
