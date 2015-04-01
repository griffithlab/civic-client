'use strict';

describe('GenesViewConfig', function () {
  var $rootScope,
    $compile,
    $state,
    $timeout,
    $controller,
    $q,
    GenesService,
    Genes,
    MyGeneInfoService,
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
    module('civic.events.genes', function ($provide, $stateProvider, servedGene238, servedMyGeneInfo238) {
      // set up mock service providers
      $provide.value('Genes', GenesService = {
        get: sinon.stub().withArgs({ geneId: 238 }).resolves(servedGene238)
      });
      $provide.value('MyGeneInfo', MyGeneInfoService = {
        getDetails: sinon.stub().withArgs(238).resolves(servedMyGeneInfo238)
      });

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
    inject(function(_$rootScope_, _$compile_, _$controller_, _$state_, _$timeout_, _$q_, _$templateCache_, _Genes_, _MyGeneInfo_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $controller = _$controller_;
      $state = _$state_;
      $timeout = _$timeout_;
      $q = _$q_;
      Genes = _Genes_;
      MyGeneInfo = _MyGeneInfo_;

      sinonAsPromised($q);

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
      expect($state.$current.parent.locals.globals.Genes).to.exist;
      expect($state.$current.parent.locals.globals.Genes).to.be.an('object');
      expect($state.$current.parent.locals.globals.Genes.get).to.be.a('function');
    });

    it('successfully resolves the MyGeneInfo service', function () {
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      expect($state.$current.parent.locals.globals.MyGeneInfo).to.exist;
      expect($state.$current.parent.locals.globals.MyGeneInfo).to.be.an('object');
      expect($state.$current.parent.locals.globals.MyGeneInfo.getDetails).to.be.a('function');
    });

    it('retrieves specific gene info from MyGeneInfo service', function () {
      var egState = $state.get('events.genes');
      var gene;
      var myGeneInfo;
      expect(egState.resolve.myGeneInfo).to.exist;
      expect(egState.resolve.myGeneInfo).to.be.a('function');
      egState.resolve.gene(Genes, {geneId: 238 }).then(function(result) {
        gene = result;
      });
      $rootScope.$digest();
      egState.resolve.myGeneInfo(MyGeneInfo, gene).then(function(result) {
        myGeneInfo = result;
      });
      $rootScope.$digest();
      expect(myGeneInfo._id).to.equal('238');
    });

    it('requests GenesViewController to be instantiated', function () {
      // TODO: figure out how to test if the controller is actually created
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      expect($state.$current.name).to.equal('events.genes.child');
      expect($state.$current.parent.controller).to.equal('GenesViewController');
    });
  });
});
