'use strict';

/* jasmine specs for controllers go here */

describe('FriendCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(angular.module('friend'));

    describe('FriendCtrl', function(){

        it('should create "phones" model with 2 phones fetched from xhr', function() {
            inject(function(_$httpBackend_, $rootScope, $controller) {
                $httpBackend = _$httpBackend_;
                $httpBackend.expectGET('phones/phones.json').respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
                scope = $rootScope.$new();
                ctrl = $controller('FriendCtrl', {$scope: scope});

            expect(scope.phones).toBeUndefined();
            $httpBackend.flush();

            expect(scope.phones).toEqual([{name: 'Nexus S'},
                {name: 'Motorola DROID'}]);
        });

    });



})});



