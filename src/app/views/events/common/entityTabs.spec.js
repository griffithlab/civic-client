'use strict';
/*jshint expr:true */
describe('entityTabs', function () {
  var $rootScope,
    $compile,
    $state,
    $controller,
    $httpBackend,

    _,

    GenesViewController,
    mockViewElem, // DOM element of mocked events.genes ui-view
    mockViewScope, // scope of mocked events.genes ui-view
    dirElem, // element of entity-view directive
    dirScope; // scope of entity-view directive

  function goFromState(state1, params1) {
    return {
      toState: function (state2, params2) {
        $state.go(state1, params1);
        $rootScope.$digest();
        $state.go(state2, params2);
        $rootScope.$digest();
      }};
  }

  beforeEach(function () {
    // load civic modules
    module('civic.services');
    module('civic.common');
    module('civic.events');
    module('civic.templates'); // load ng-html2js templates
    module('civic.events.common'); // load common events directives
    module('civic.events.genes', function ($provide, $stateProvider) {
      // GenesViewController is attached to an abstract state so we need to create parent and
      // child states of events.genes, then transition between then in order to force ui-router to instantiate it
      // events.gene.child loads the entity-view directive for testing, and we get a reference to it
      // below after transitioning to the state and building GeneViewController
      $stateProvider
        .state('initial', {
          abstract: false,
          url: '/initial',
          template: '<ui-view/>'
        });
      $stateProvider
        .state('events.genes.child', {
          abstract: false,
          url: '/child',
          template: '<mock-ui-view><entity-view entity-model="geneModel"><entity-tabs></entity-tabs></entity-view></mock-ui-view>'
        })
    });

    // load json fixtures for httpBackend mocked responses
    module('served/gene238.json');
    module('served/gene238Variants.json');
    module('served/gene238VariantGroups.json');
    module('served/myGeneInfo238.json');
    module('served/gene238Comments.json');
    module('served/gene238Comment1.json');
    module('served/gene238Comment1Updated.json');
    module('served/gene238SuggestedChangeSubmitted.json');
    module('served/gene238SuggestedChangeAccepted.json');
    module('served/gene238SuggestedChanges.json');
    module('served/gene238SuggestedChange1.json');
    module('served/gene238Revisions.json');
    module('served/gene238Revisions1.json');
    module('served/gene238RevisionsLast.json');

    // inject services
    inject(function(_$rootScope_,
                    _$compile_,
                    _$controller_,
                    _$state_,
                    _$httpBackend_,
                    servedGene238,
                    servedMyGeneInfo238,
                    servedGene238Variants,
                    servedGene238VariantGroups) {
      $state = _$state_;
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;

      _ = window._;

      // setup mocked backend responses
      $httpBackend.when('GET', '/api/genes/238').respond(servedGene238);
      $httpBackend.when('GET', '/api/genes/mygene_info_proxy/238').respond(servedMyGeneInfo238);
      $httpBackend.when('GET', '/api/genes/238/variants').respond(servedGene238Variants);
      $httpBackend.when('GET', '/api/genes/238/variant_groups').respond(servedGene238VariantGroups);

      // instantiate GenesViewController using resolved deps from event.genes state
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      expect($state.$current.name).to.equal('events.genes.child');
      var deps  = $state.$current.parent.locals.globals;
      var geneViewScope = $rootScope.$new();

      GenesViewController = $controller('GenesViewController', {
        $scope: geneViewScope,
        Genes: deps.Genes,
        MyGeneInfo: deps.MyGeneInfo,
        gene: deps.gene,
        variants: deps.variants,
        variantGroups: deps.variantGroups,
        myGeneInfo: deps.myGeneInfo
      });

      expect(GenesViewController).to.exist;
      expect(GenesViewController).to.be.an('object');

      // compile test child template
      mockViewElem = $compile($state.current.template)(geneViewScope);
      mockViewScope  = mockViewElem.scope();
      mockViewScope.$digest();

      expect(mockViewScope.geneModel).to.exist;
      expect(mockViewScope.geneModel).to.be.an('object');

      dirElem = $(mockViewElem).find('entity-tabs');
      dirScope = $(dirElem).children(':first').scope();
    });

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('directive', function(){
    it('is successfully instantiated within the context of GeneViewController', function() {
      expect(dirElem).to.exist;
      expect(dirScope).to.exist;
    });

    it('uses an isolate scope', function() {
      expect(dirScope.geneModel).to.not.exist; // would inherit from GeneViewController if not isolate scope
    });
  });

  describe('linking function', function() {
    it('creates ctrl object to hold template resources', function() {
      expect(dirScope.ctrl).to.exist;
      expect(dirScope.ctrl).to.be.an('object');
    });

    it('attaches entityModel from required entityView controller object to scope.ctrl', function() {
      expect(dirScope.ctrl.entityModel).to.exist;
      expect(dirScope.ctrl.entityModel).to.be.an('object');
      expect(dirScope.ctrl.entityModel).to.not.be.empty;
    });

  });

  describe('controller function', function() {
    it('provides entity type', function() {
      expect(dirScope.ctrl.type).to.exist;
      expect(dirScope.ctrl.type).to.equal('gene');
    });

    it('provides entity type', function() {
      expect(dirScope.ctrl.type).to.exist;
      expect(dirScope.ctrl.type).to.equal('gene');
    });
    it('provides entity name', function() {
      expect(dirScope.ctrl.type).to.exist;
      expect(dirScope.ctrl.type).to.equal('gene');
    });

    it('provides base state URL', function() {
      expect(dirScope.ctrl.baseUrl).to.exist;
      expect(dirScope.ctrl.baseUrl).to.equal('#/events/genes/238');
    });

    it('unbinds the ctrl.entityModel watch expression after one execution', function() {
      var modelWatcher = _.find(dirScope.$$watchers, function(watch) {
        return watch.exp === 'ctrl.entityModel';
      });
      expect(modelWatcher).to.be.empty;
    });
  });

  describe('template', function() {
    it('displays a header with the proper entity type and name', function() {
      var headerTxt = $(dirElem).find('.name h3').text();
      expect(headerTxt).to.contain('Gene');
      expect(headerTxt).to.contain('ALK');
    });

    it('displays Summary and Talk tabs labelled with the proper entity type', function() {
      var tabLabels = $(dirElem).find('.tabs a span');
      expect($(tabLabels[0]).text()).to.equal('Gene');
      expect($(tabLabels[1]).text()).to.equal('Gene');
    });
  });

  describe('tabs', function() {
    it('provide link to entity summary state', function() {
      var anchor = _.find($(dirElem).find('.tabs a'), function(anchor) {
        return _.endsWith($(anchor).attr('href'), 'summary');
      });
      expect(anchor).to.not.be.empty;
    });

    it('provide link to entity talk state', function() {
      var anchor = _.find($(dirElem).find('.tabs a'), function(anchor) {
        return _.endsWith($(anchor).attr('href'), 'talk');
      });
      expect(anchor).to.not.be.empty;
    });
  });

});
