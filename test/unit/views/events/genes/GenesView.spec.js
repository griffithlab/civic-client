'use strict';

describe('events.genes state', function() {

  var $rootScope,
    $state,
    $injector,
    GenesService,
    MyGeneInfoService,
    state = 'events.genes';

  beforeEach(function() {

    module('civic.events', function($provide) {
      $provide.value('Genes', GenesService = {});
      $provide.value('MyGeneInfo', MyGeneInfoService = {});
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

  it('should be abstract', function() {
    expect($state.get(state).abstract).to.be.true;
  });

  it('should specify the url "/genes/:geneId"', function() {
    expect($state.get(state).url).to.equal('/genes/:geneId');
  });

  it('should respond to the url "#/events/genes/1"', function() {
    expect($state.href(state, { geneId: 1 })).to.equal('#/events/genes/1');
  });

  it('should resolve Genes service', function() {

  });

  it('should resolve MyGeneInfo service', function() {

  });

  it('should resolve gene data', function() {

  });

  it('should resolve gene myGene data', function() {

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
