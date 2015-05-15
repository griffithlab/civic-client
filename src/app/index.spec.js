'use strict';

describe('civicClient run initializations', function(){
  beforeEach(module('civicClient'));

  it('creates a view object on $rootScope to hold global view attributes', inject(function($rootScope) {
    expect($rootScope.view).to.be.an('object');
  }));

  it('makes $state globally addressable by placing it on $rootScope', inject(function($rootScope) {
    expect($rootScope.$state.current.abstract).to.be.a('boolean');
  }));
});

//describe('civicClient run block navMode updates', function() {
//
//  beforeEach(module('civicClient'));
//  beforeEach(inject(function(_$httpBackend_) {
//    var $httpBackend = _$httpBackend_;
//
//    // mock required templates
//    $httpBackend.whenGET('app/pages/home.tpl.html').respond('<div>mock template</div>');
//
//    // mock a current_user call as appRun calls Security.requestCurrentUser()
//    $httpBackend.whenGET('/api/current_user.json')
//      .respond(
//      {
//        "id": 1,
//        "email": "bob@example.com",
//        "name": "Bob Dobbs",
//        "username": "bdobbs",
//        "roles": [
//          "user"
//        ]
//      }
//    );
//  }));
//  it('sets navMode to "home" when user navigates to a home-designated state', inject(function($rootScope, $state){
//    $rootScope.$broadcast('$stateChangeSuccess', {});
//    $rootScope.$digest();
////    expect($state.current.data.navMode).to.eventually.equal('home');
//    expect($rootScope.view.navMode).to.equal('home');
//  }));
//});
