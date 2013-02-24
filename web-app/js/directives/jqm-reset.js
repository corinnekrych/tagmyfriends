friend.directive('jqmReset', function() {
        return function(scope, element, attrs) {
            // watch the expression, and update the UI on change.
            scope.$watch(attrs.listRefresh, function(value) {
                $('input[data-type="date"]').each(function () {
                    $(this).scroller('destroy').scroller({
                        preset:'date',
                        theme:'default',
                        display:'modal',
                        mode:'scroller',
                        dateOrder:'mmD ddyy'
                    });
                });
            });
        }
    });
