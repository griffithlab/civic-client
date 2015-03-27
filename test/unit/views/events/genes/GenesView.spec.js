'use strict';

describe('events.genes state', function () {
  var $rootScope,
    $state,
    $injector,
    $timeout,
    GenesService,
    Genes,
    MyGeneInfoService,
    MyGeneInfo,
    state = 'events.genes';

  describe('sinon-as-promised angular example', function () {
    module('q-constructor');
    beforeEach(inject(function ($rootScope, _$q_, _$timeout_) {
      // add $q constructor behavior to work with sinon-as-promised
      function $q (resolver) {
        var deferred = _$q_.defer();
        var resolve = angular.bind(deferred, deferred.resolve);
        var reject = angular.bind(deferred, deferred.reject);
        var promise = deferred.promise;

        resolver(resolve, reject);

        return promise;
      }
      sinonAsPromised($q);
      $timeout = _$timeout_;
    }));

    it('can create a stub that resolves', function () {
      var stub = sinon.stub().resolves('value');
      var fulfilled = false;
      stub().then(function (value) {
        fulfilled = true;
        expect(value).to.equal('value');
      });
      expect(fulfilled).to.be.false;
      $timeout.flush();
      expect(fulfilled).to.be.true;
    });

  });

  //beforeEach(function () {
  //  module('civic.events', function ($provide) {
  //    $provide.value('Genes', GenesService = {
  //      get: sinon.stub().resolves('GENE')
  //    });
  //    $provide.value('MyGeneInfo', MyGeneInfoService = {});
  //  });
  //
  //  inject(function (_$rootScope_,
  //                   _$state_,
  //                   _$injector_,
  //                   _$timeout_,
  //                   _Genes_,
  //                   _MyGeneInfo_,
  //                   $templateCache,
  //                   $q) {
  //    $rootScope = _$rootScope_;
  //    $state = _$state_;
  //    $injector = _$injector_;
  //    $timeout = _$timeout_;
  //
  //    Genes = _Genes_;
  //    MyGeneInfo = _MyGeneInfo_;
  //
  //    // set up sinon-as-promised
  //    sinonAsPromised($q);
  //
  //    // We need add the template entry into the templateCache if we ever
  //    // specify a templateUrl
  //    $templateCache.put('app/views/events/genes/GenesView.tpl.html', '<div ui-view></div>');
  //  })
  //});

  //it('should be abstract', function () {
  //  expect($state.get(state).abstract).to.be.true;
  //});
  //
  //it('should specify the url "/genes/:geneId"', function () {
  //  expect($state.get(state).url).to.equal('/genes/:geneId');
  //});
  //
  //it('should respond to the url "#/events/genes/1"', function () {
  //  expect($state.href(state, {geneId: 1})).to.equal('#/events/genes/1');
  //});
  //
  //it('requests Genes service to be resolved', function () {
  //  var egState = $state.get(state);
  //  expect(egState.resolve.Genes).to.exist;
  //  expect(egState.resolve.Genes).to.equal('Genes');
  //});
  //
  //it('requests MyGeneInfo service to be resolved', function () {
  //  var egState = $state.get(state);
  //  expect(egState.resolve.MyGeneInfo).to.exist;
  //  expect(egState.resolve.MyGeneInfo).to.equal('MyGeneInfo');
  //});
  //
  //it('resolves specific gene from Genes service', function () {
  //  var egState = $state.get(state);
  //  var geneData;
  //
  //  expect(egState.resolve.gene).to.exist;
  //  expect(egState.resolve.gene).to.be.a('function');
  //  console.log('-----');
  //  console.log(Genes.get());
  //  expect(Genes.get().resolve).to.eventually.equal('GENE');
  //
  //  expect(geneData).to.be.a('string');
  //
  //});

  //
  //it('should resolve MyGeneInfo service', function () {
  //
  //});
  //
  //it('should resolve gene data', function () {
  //
  //});
  //
  //it('should resolve gene myGene data', function () {
  //
  //});


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
