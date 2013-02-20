friend.directive('listRefresh', function() {
        return function(scope, element, attrs) {
            // watch the expression, and update the UI on change.
            scope.$watch(attrs.listRefresh, function(value) {
               $('#list-' + attrs.listRefresh).listview('refresh');
            });
        }
    });
