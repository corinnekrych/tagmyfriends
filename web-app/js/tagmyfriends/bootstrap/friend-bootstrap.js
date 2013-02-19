define(["tagmyfriends/configuration-bootstrap",
    "tagmyfriends/view/friend-view"],
    function (conf, view) {
        var config = conf;

        config.domain.push({
            name:'friend',
            view:{
                'save':$('#submit-friend'),
                'add':$('#add-friend'),
                'show':$('a[id^="friend-list-"]'),
                'remove':$('#delete-friend')
            },
            options:{
                offline:false,
                eventPush:false
            }
        });
        return config;
    });
