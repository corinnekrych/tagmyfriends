var tagmyfriends = tagmyfriends || {};


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
