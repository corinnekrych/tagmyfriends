friend.directive('listRefresh', function() {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
            // watch the expression, and update the UI on change.
            scope.$watch(attrs.listRefresh, function(value) {
               $('#list-friend').listview('refresh');
            });

        }
    });
