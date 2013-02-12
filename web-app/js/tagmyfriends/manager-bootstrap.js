define(["tagmyfriends/bootstrap/friend-bootstrap",
    "tagmyfriends/bootstrap/place-bootstrap",
    "tagmyfriends/bootstrap/checkin-bootstrap",
    "grails/mobile/mvc/manager"], function (friendConf, placeConf, checkinConf, manager) {
    return manager(friendConf);
});
