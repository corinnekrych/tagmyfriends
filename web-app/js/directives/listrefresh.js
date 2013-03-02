friend.directive('listRefresh', function () {

    var directiveDefinitionObject = {
        priority: 550,
        compile:function compile(tElement, tAttrs) {
            return function postLink(scope, element, attrs) {
                // watch the expression, and update the UI on change.
                scope.$watch(attrs.listRefresh, function (value) {
                    $('#' + attrs.listRefresh).listview('refresh');
                });
            }
        }
    };

    return directiveDefinitionObject;
});


//friend.directive('listRefresh', function () {
//    var directiveDefinitionObject = {
//        priority: 0,
//        compile: function compile(tElement, tAttrs) {
//            return function postLink(scope, element, attrs) {
//                // watch the expression, and update the UI on change.
//                //element.bind('pageinit', function () {
//                    scope.$watch(attrs.listRefresh, function (value) {
//                        element.find("ul").listview('refresh');
//                    });
//                //});
//            }
//        }
//    };
//
//    return directiveDefinitionObject;
//});