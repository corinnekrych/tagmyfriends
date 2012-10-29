


var tagmyfriends = tagmyfriends || {};

tagmyfriends.load = (function () {

    var configuration = {
        baseURL: "http://localhost:8080/tagmyfriends/",
        namespace: "tagmyfriends",
        domain:[
            {
                name: "place",
                view: {
                    'list': $('#section-list-places'),
                    'save': $("#submit-place"),
                    'add': $('#section-show-place'),
                    'remove': $("#delete-place")
                }
            }
        ]
    };
    var managerObject = grails.mobile.mvc.manager(configuration);

}());

