define(["tagmyfriends/configuration-bootstrap",
    "tagmyfriends/view/checkin-view"],
    function (conf, view) {
        var config = conf;
        config.domain.push({
            name:'checkin',
            view:{
                'list':$('#section-list-checkin'),
                'save':$('#submit-checkin'),
                'add':$('#add-checkin'),
                'show':$('a[id^="checkin-list-"]'),
                'remove':$('#delete-checkin')
            },
            hasOneRelations:[
                {type:'place', name:'place'}
            ],
            oneToManyRelations:[
                {type:'friend', name:'friends'}
            ],
            options:{
                offline:true,
                eventPush:true
            }

        });
        return config;
    });
