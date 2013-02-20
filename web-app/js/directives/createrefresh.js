friend.directive('createRefresh', function() {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
            $scope.friends.$whenReady(function () {
            //$scope.$on('$includeContentLoaded', function () {
                $('#section-list-friend').trigger("create");
            });
        }
    });
