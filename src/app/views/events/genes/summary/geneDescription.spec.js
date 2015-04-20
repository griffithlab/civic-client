'use strict';
/*jshint expr:true */
describe('geneDescription', function () {
  var $rootScope,
    $compile,
    $state,
    $controller,
    $httpBackend,
    $document,
    $timeout,

    _,

    GenesViewController,
    genesViewScope,
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
      // need to create an initial state to transition from
      $stateProvider
        .state('initial', {
          abstract: false,
          url: '/initial',
          template: '<ui-view></ui-view>'
        })
        .state('events.genes.child', {
          abstract: false,
          url: '/child',
          template:
          '<mock-ui-view>' +
          '<entity-view entity-model="geneModel">' +
          '<entity-tabs entity-model="geneModel"></entity-tabs>' +
          '<gene-summary>' +
          '</gene-summary>' +
          '</entity-view>' +
          '</mock-ui-view>'
        });
    });

    // load json fixtures for httpBackend mocked responses
    module('served/gene238.json');
    module('served/gene238Variants.json');
    module('served/gene238VariantGroups.json');
    module('served/myGeneInfo238.json');

    // inject services
    inject(function(_$rootScope_,
                    _$compile_,
                    _$controller_,
                    _$state_,
                    _$httpBackend_,
                    _$document_,
                    _$timeout_,
                    servedGene238,
                    servedMyGeneInfo238,
                    servedGene238Variants,
                    servedGene238VariantGroups) {
      $state = _$state_;
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;
      $document = _$document_;
      $timeout = _$timeout_;

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
      genesViewScope = $rootScope;

      GenesViewController = $controller('GenesViewController', {
        $scope: genesViewScope,
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
      mockViewElem = $compile($state.current.template)(genesViewScope);
      mockViewScope  = mockViewElem.scope();
      mockViewScope.$digest();

      expect(mockViewScope.geneModel).to.exist;
      expect(mockViewScope.geneModel).to.be.an('object');

      dirElem = $(mockViewElem).find('gene-description');
      dirScope = $(dirElem).children(':first').scope();
    });

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('directive', function(){
    it('is successfully instantiated within the context of gene-summary', function() {
      expect(dirElem).to.exist;
      expect(dirScope).to.exist;
    });

    it('uses an isolate scope', function() {
      expect(dirScope.geneModel).to.not.exist; // would find on GeneViewController if not isolate scope
    });
  });

  describe('controller', function() {
    it('provides the gene object on scope', function(){
      expect(dirScope.ctrl.gene).to.exist;
      expect(dirScope.ctrl.gene).to.be.an('object');
      expect(dirScope.ctrl.gene.entrez_name).to.equal('ALK');
    });
  });

  describe('geneDescription template', function() {
    it('displays the correct title', function() {
      expect(dirElem.find('.description').text()).to.contain('mutations in ALK have been shown to confer resistance to current tyrosine kinase inhibitors');
    });

    it('displays sources', function() {
      expect(dirElem.find('.sources li').length).to.be.above(0);
      expect($(dirElem.find('.sources li')[0]).text()).to.contain('Shaw et al., 2013, J. Clin. Oncol.');
    });
  });

});
