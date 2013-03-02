friend.directive('createRefresh', function() {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
            scope.$on('$includeContentLoaded', function () {
                    $('#section-' + attrs.createRefresh).trigger("pagecreate");
            });
        }
    });
