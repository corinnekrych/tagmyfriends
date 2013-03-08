'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('tagmyfriends CRUD application', function() {

  beforeEach(function() {
    browser().navigateTo('tagmyfriends/index.html');
  });


  describe('add a friend', function() {

//    beforeEach(function() {
//
//    });


    it('should render edit mode', function() {
        browser().click('#submit-friend', 'Create');

//        expect(element('[ng-view] p:first').text()).
//        toMatch(/partial for view 1/);
    });

  });
});
