'use strict';

describe('Controller: FriendCtrl', function() {

  // load the controller's module
  beforeEach(module('friend'));

  var FriendCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
      FriendCtrl = $controller('FriendCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
