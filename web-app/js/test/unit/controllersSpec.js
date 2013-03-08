'use strict';

/* jasmine specs for controllers go here */
describe('Friend controller CRUD operations', function () {

    var $scope;
    var $controller;
    var $httpBackend;
    var myFriends= [];

    beforeEach(module('friend'));
    beforeEach(inject(function ($injector) {
        $scope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');

    }));

    describe('FriendCtrl', function () {
        var params, ctrl;
        beforeEach(function() {
            myFriends = new Array();
            myFriends[1] = {id:1, lastname:"matrat", firstname:"fabrice"};
            myFriends[2] = {id:2, lastname:"krych", firstname: "corinne"};
            $httpBackend.whenGET('http://localhost:8080/tagmyfriends/friend/list').respond(myFriends);

            params = {
                $scope: $scope,
                friends: myFriends,
                $: function(a, b) {
                    var myMockObject = new Function();
                    myMockObject.mobile = new Function();
                    myMockObject.mobile.changePage = function() {};
                    myMockObject.param = function() {}
                    return myMockObject;
                }()
            };

            spyOn(params.$.mobile, "changePage").andCallThrough();
            spyOn(params.$, "param").andCallThrough();
            ctrl = $controller('FriendCtrl', params);
        });

        it('should init correctly', function () {
            expect($scope.friends).toBe(myFriends);
            expect($scope.friends.length).toBe(3);
            expect($scope.actionButton).toBe("ADD");
        });

        it('should go to addItem when calling clicking on add button', function () {
            $scope.dispatch();
            expect($scope.actionButton).toBe("CREATE");
        });

        it('should go to createItem when calling clicking on create button', function () {
            $scope.actionButton = "CREATE";
            $httpBackend.whenPOST('http://localhost:8080/tagmyfriends/friend/save').respond({id:3, lastname:"new", firstname:"new"});

            $scope.dispatch();

            expect($scope.actionButton).toBe("CREATE");
            expect(params.$.param).toHaveBeenCalled();
            $httpBackend.flush();
            expect(params.$.mobile.changePage).toHaveBeenCalled();
            expect($scope.actionButton).toBe("ADD");
            expect($scope.friends.length).toBe(4);
            expect($scope.friends[3].lastname).toBe("new");
            expect($scope.friends[0]).toBe(undefined);
        });

        it('should go to updateItem when calling clicking on save button for an update', function () {

            $scope.actionButton = "UPDATE";
            $scope.currentId = "1";
            $httpBackend.whenPOST('http://localhost:8080/tagmyfriends/friend/update').respond({});

            $scope.dispatch();

            expect($scope.actionButton).toBe("UPDATE");
            expect(params.$.param).toHaveBeenCalled();
            $httpBackend.flush();
            expect(params.$.mobile.changePage).toHaveBeenCalled();
            expect($scope.actionButton).toBe("ADD");
            expect($scope.friends.length).toBe(3);
            expect($scope.friends[0]).toBe(undefined);
        });

        it('should go to deleteItem when calling clicking on delete button', function () {

            $scope.actionButton = "DELETE";
            $scope.currentId = "1";
            $httpBackend.whenPOST('http://localhost:8080/tagmyfriends/friend/delete').respond({});

            $scope.delete();

            expect($scope.actionButton).toBe("DELETE");
            $httpBackend.flush();
            expect(params.$.mobile.changePage).toHaveBeenCalled();
            expect($scope.actionButton).toBe("ADD");
            expect($scope.friends.length).toBe(3);
            expect($scope.friends[0]).toBe(undefined);
            expect($scope.friends[1]).toBe(undefined);
        });

    });

});



