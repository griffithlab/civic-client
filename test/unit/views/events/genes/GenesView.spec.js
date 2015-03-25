'use strict';

describe('events.genes state', function() {

  var $rootScope,
    $state,
    $injector,
    GenesMock,
    MyGeneInfoMock,
    state = 'events.genes';

  beforeEach(function() {

    module('civic.events', function($provide) {
      $provide.value('GenesService', GenesMock = {});
      $provide.value('MyGeneInfoService', MyGeneInfoMock = {});
    });

    inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;

      // We need add the template entry into the templateCache if we ever
      // specify a templateUrl
      $templateCache.put('app/views/events/genes/GenesView.tpl.html', '<div ui-view></div>');
    })
  });

  it('should respond to URL', function() {
    expect($state.href(state, { geneId: 1 })).to.equal('#/events/genes/1');
  });

  //it('should resolve data', function() {
  //  myServiceMock.findAll = jasmine.createSpy('findAll').andReturn('findAll');
  //
  //  $state.go(state);
  //  $rootScope.$digest();
  //  expect($state.current.name).toBe(state);
  //
  //  // Call invoke to inject dependencies and run function
  //  expect($injector.invoke($state.current.resolve.data)).toBe('findAll');
  //});
});
