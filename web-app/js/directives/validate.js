friend.directive('validate', function () {

    var directiveDefinitionObject = {
        priority: 0,

        link:function postLink(scope, element, attrs) {
                // watch the expression, and update the UI on change.
                scope.$watch(attrs.validate, function (value) {


                    var actionButton = attrs.action;
                    if(actionButton === 'ADD')
                      return;
                    if(actionButton === 'CREATE') {
                        $('[jqm-valid="true"]').addClass('ui-disabled');
                    }

                    if(value) {
                        $('[jqm-valid="true"]').removeClass('ui-disabled');
                    } else {
                        $('[jqm-valid="true"]').addClass('ui-disabled');
                    }
                });
        }
    };

    return directiveDefinitionObject;
});
