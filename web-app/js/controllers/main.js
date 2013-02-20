'use strict';

tagmyfriends.controller('MainCtrl', function($scope) {

    $scope.$on('$includeContentLoaded', function() {
        $('#myList').parent().trigger('create');
    });
});
