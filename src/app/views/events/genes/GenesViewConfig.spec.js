'use strict';

describe('GenesViewConfig', function () {
  var $rootScope,
    $httpBackend,
    $state,
    $controller,
    Genes,
    MyGeneInfo,
    state = 'events.genes';

  // helpful utilities for testing ui.router state transitions
  function goTo(url) {
    $location.url(url);
    $rootScope.$digest();
  }

  function goFromUrl(url) {
    return {
      toState: function (state, params) {
        $location.replace().url(url); //Don't actually trigger a reload
        $state.go(state, params);
        $rootScope.$digest();
      }};
  }

  function goFromState(state1, params1) {
    return {
      toState: function (state2, params2) {
        $state.go(state1, params1);
        $rootScope.$digest();
        $state.go(state2, params2);
        $rootScope.$digest();
      }};
  }

  function resolve(value) {
    return {
      forStateAndView: function (state, view) {
        var viewDefinition = view ? $state.get('events.genes').views[view] : $state.get('events.genes');
        return $injector.invoke(viewDefinition.resolve[value]);
      }};
  }

  beforeEach(function () {
    module('civic.services');
    module('civic.events');
    module('served/gene238.json');
    module('served/myGeneInfo238.json');
    module('served/gene238Variants.json');
    module('served/gene238VariantGroups.json');
    module('civic.events.genes', function ($stateProvider) {

      // as events.genes is an abstract state and cannot be navigated to,
      // we need to create a navigable events.genes.child state for to
      // force events.genes state to instantiate its controller and inject deps
      $stateProvider
        .state('initial', {
          abstract: false,
          url: '/test1',
          template: '<ui-view/>'
        });
      $stateProvider
        .state('events.genes.child', {
          abstract: false,
          url: '/test2',
          template: '<ui-view/>'
        })
    });

    module('q-constructor'); // switch to v1.3 $q constructor for sinon-as-promised
    module('civic.templates'); // load ng-html2js templates

    // inject services
    inject(function(_$rootScope_,
                    _$httpBackend_,
                    _$controller_,
                    _$state_,
                    servedGene238,
                    servedMyGeneInfo238,
                    servedGene238Variants,
                    servedGene238VariantGroups    ) {
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      $controller = _$controller_;
      $state = _$state_;

      // set up mock service providers
      $httpBackend.when('GET', '/api/genes/238').respond(servedGene238);
      $httpBackend.when('GET', '/api/genes/mygene_info_proxy/238').respond(servedMyGeneInfo238);
      $httpBackend.when('GET', '/api/genes/238/variants').respond(servedGene238Variants);
      $httpBackend.when('GET', '/api/genes/238/variant_groups').respond(servedGene238VariantGroups);

      //  ui-router debug logging
      //function message(to, toP, from, fromP) { return from.name  + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP); }
      //$rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) { console.log("Start:   " + message(to, toP, from, fromP)); });
      //$rootScope.$on("$stateChangeSuccess", function(evt, to, toP, from, fromP) { console.log("Success: " + message(to, toP, from, fromP)); });
      //$rootScope.$on("$stateChangeError", function(evt, to, toP, from, fromP, err) { console.log("Error:   " + message(to, toP, from, fromP), err); });

    });
  });

  describe('events.genes state configuration', function() {
    it('should be abstract', function () {
      expect($state.get('events.genes').abstract).to.be.true;
    });

    it('should specify the url "/genes/:geneId"', function () {
      expect($state.get('events.genes').url).to.equal('/genes/:geneId');
    });

    it('should respond to the url "#/events/genes/238"', function () {
      expect($state.href(state, { geneId: 238 })).to.equal('#/events/genes/238');
    });

    it('requests Genes service to be resolved', function () {
      var egState = $state.get('events.genes');
      expect(egState.resolve.Genes).to.exist;
      expect(egState.resolve.Genes).to.equal('Genes');
    });

    it('requests MyGeneInfo service to be resolved', function () {
      var egState = $state.get('events.genes');
      expect(egState.resolve.MyGeneInfo).to.exist;
      expect(egState.resolve.MyGeneInfo).to.equal('MyGeneInfo');
    });

    it('successfully resolves the Genes service', function () {
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      var Genes = $state.$current.parent.locals.globals.Genes;
      expect(Genes).to.exist;
      expect(Genes).to.be.an('object');
      expect(Genes.get).to.be.a('function');
    });

    it('successfully resolves the MyGeneInfo service', function () {
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      var MyGeneInfo = $state.$current.parent.locals.globals.MyGeneInfo;
      expect(MyGeneInfo).to.exist;
      expect(MyGeneInfo).to.be.an('object');
      expect(MyGeneInfo.get).to.be.a('function');
    });

    it('successfully resolves gene 238', function() {
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      var gene = $state.$current.parent.locals.globals.gene;
      expect(gene).to.exist;
      expect(gene).to.be.an('object');
      expect(gene.entrez_id).to.equal(238);
    });

    it('successfully resolves myGeneInfo for gene 238', function() {
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      var myGeneInfo = $state.$current.parent.locals.globals.myGeneInfo;
      expect(myGeneInfo).to.exist;
      expect(myGeneInfo).to.be.an('object');
      expect(Number(myGeneInfo._id)).to.equal(238);
    });

    it('successfully resolves variants for gene 238', function() {
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      var variants = $state.$current.parent.locals.globals.variants;
      expect(variants).to.exist;
      expect(variants).to.be.an('array');
      expect(variants[0].entrez_name).to.equal('ALK');
    });

    //it('retrieves specific gene info from MyGeneInfo service', function () {
    //  var egState = $state.get('events.genes');
    //  var gene;
    //  var myGeneInfo;
    //  expect(egState.resolve.myGeneInfo).to.exist;
    //  expect(egState.resolve.myGeneInfo).to.be.a('function');
    //  egState.resolve.gene(Genes, {geneId: 238 }).then(function(result) {
    //    gene = result;
    //  });
    //  $rootScope.$digest();
    //  egState.resolve.myGeneInfo(MyGeneInfo, gene).then(function(result) {
    //    myGeneInfo = result;
    //  });
    //  $rootScope.$digest();
    //  expect(myGeneInfo._id).to.equal('238');
    //});
    //
    //it('requests GenesViewController to be instantiated', function () {
    //  // TODO: figure out how to test if the controller is actually created
    //  goFromState('initial').toState('events.genes.child', { geneId: 238 });
    //  expect($state.$current.name).to.equal('events.genes.child');
    //  expect($state.$current.parent.controller).to.equal('GenesViewController');
    //});
  });
});
