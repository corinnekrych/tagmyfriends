requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {

    }
});

require(["tagmyfriends/bootstrap/place-bootstrap",
    "tagmyfriends/manager-bootstrap"],
    function (bootstrap, managerBoostrap) {
        managerBoostrap.domainsObjects['place'].controller.listItem(true);
    });
