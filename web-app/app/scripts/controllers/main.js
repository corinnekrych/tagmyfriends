'use strict';

tagmyfriends.controller('MainCtrl', function($scope) {

//  $scope.$on('$viewContentLoaded', function() {
//      $('#myList').parent().trigger('create');
////      if ($('#myList[ul]').length != 0) {
////          $('#myList').listview('refresh');
////      }
//  });

    $scope.$on('$includeContentLoaded', function() {
        $('#myList').parent().trigger('create');
    });
});
