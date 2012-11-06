


var tagmyfriends = tagmyfriends || {};

tagmyfriends.loadConfiguration = (function () {
    tagmyfriends.configuration = {
        baseURL: "http://localhost:8080/tagmyfriends2/",
        namespace: "tagmyfriends",
        domain:[]
    };
})();

tagmyfriends.loadCheckin = (function () {

    tagmyfriends.configuration.domain.push(
            {
                name: "checkin",
                view: {
                    'list': $('#section-list-checkins'),
                    'save': $("#submit-checkin"),
                    'add': $('#section-show-checkin'),
                    'remove': $("#delete-checkin")
                },
                hasOneRelations: ["place"]
            });

}());

tagmyfriends.loadPlace = (function () {

    tagmyfriends.configuration.domain.push(
        {
            name: "place",
            view: {
                'list': $('#section-list-places'),
                'save': $("#submit-place"),
                'add': $('#section-show-place'),
                'remove': $("#delete-place")
            }
        });

}());

tagmyfriends.loadFriend = (function () {

    tagmyfriends.configuration.domain.push(
        {
            name: "friend",
            view: {
                'list': $('#section-list-friends'),
                'save': $("#submit-friend"),
                'add': $('#section-show-friend'),
                'remove': $("#delete-friend")
            }
        });

}());

tagmyfriends.load = (function () {

    var managerObject = grails.mobile.mvc.manager(tagmyfriends.configuration);

}());

