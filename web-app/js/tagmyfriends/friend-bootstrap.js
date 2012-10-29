


var tagmyfriends = tagmyfriends || {};

tagmyfriends.load = (function () {

    var configuration = {
        baseURL: "http://localhost:8080/tagmyfriends/",
        namespace: "tagmyfriends",
        domain:[
            {
                name: "friend",
                view: {
                    'list': $('#section-list-friends'),
                    'save': $("#submit-friend"),
                    'add': $('#section-show-friend'),
                    'remove': $("#delete-friend")
                }
            }
        ]
    };
    var managerObject = grails.mobile.mvc.manager(configuration);

}());

