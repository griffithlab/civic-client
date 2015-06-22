'use strict';
/*jshint expr:true */
describe('entityView', function () {
  var $rootScope,
    $compile,
    $state,
    $controller,
    $httpBackend,

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
      // child states of events.genes, then transition between then in order to force ui-router to instantiate it.
      // events.gene.child loads the entity-view directive for testing, and we get a reference to it
      // below after transitioning to the state and building GeneViewController
      $stateProvider
        .state('initial', {
          abstract: false,
          url: '/initial',
          template: '<ui-view></ui-view>'
        });
      $stateProvider
        .state('events.genes.child', {
          abstract: false,
          url: '/child',
          template: '<mock-ui-view><entity-view entity-model="geneModel"><p>Entity: <span ng-bind="entityModel.config.name | capitalize"></span></p></p></entity-view></mock-ui-view>'
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
                    servedGene238,
                    servedMyGeneInfo238,
                    servedGene238Variants,
                    servedGene238VariantGroups) {
      $state = _$state_;
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;

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

      dirElem = $(mockViewElem).find('entity-view');
      dirScope = $(dirElem).children(':first').scope();
    });

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('entityView directive', function(){
    it('is successfully instantiated within the context of GeneViewController', function() {
      expect(dirElem).to.exist;
      expect(dirScope).to.exist;
    });

    it('attaches valid entityModel object to its scope', function() {
      expect(dirScope.entityModel).to.exist;
      expect(dirScope.entityModel).to.be.an('object');
      expect(dirScope.entityModel).to.not.be.empty;
    });
  });
});
