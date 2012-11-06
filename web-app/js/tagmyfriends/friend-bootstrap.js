var tagmyfriends = tagmyfriends || {};

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


