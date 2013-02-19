define(["tagmyfriends/configuration-bootstrap",
    "tagmyfriends/view/place-view"],
    function (conf, view) {
        var config = conf;
        config.domain.push({
            name:'place',
            view:{
                'list':$('#section-list-place'),
                'save':$('#submit-place'),
                'add':$('#add-place'),
                'show':$('a[id^="place-list-"]'),
                'remove':$('#delete-place')
            },
            options:{
                offline:true,
                eventPush:true
            }

        });
        return config;
    });
