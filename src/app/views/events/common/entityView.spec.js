'use strict';
/*jshint expr:true */
describe('entityView', function () {
  var $rootScope,
    $compile,
    $state,
    $controller,
    $httpBackend,

    GenesViewController,
    elem, // DOM element of mocked events.genes ui-view
    viewScope, // scope of mocked events.genes ui-view
    scope; // scope of entity-view directive

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
          template: '<entity-view entity-model="ctrl.geneModel"></entity-view>'
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
                    servedGene238VariantGroups,
                    servedGene238Comments,
                    servedGene238Comment1,
                    servedGene238Comment1Updated,
                    servedGene238SuggestedChangeSubmitted,
                    servedGene238SuggestedChangeAccepted,
                    servedGene238SuggestedChanges,
                    servedGene238SuggestedChange1,
                    servedGene238Revisions,
                    servedGene238Revisions1,
                    servedGene238RevisionsLast) {
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
      $httpBackend.when('POST', '/api/genes/238/comments').respond(201, servedGene238Comment1);
      $httpBackend.when('GET', '/api/genes/238/comments').respond(servedGene238Comments);
      $httpBackend.when('GET', '/api/genes/238/comments/1').respond(servedGene238Comment1);
      $httpBackend.when('PATCH', '/api/genes/238/comments/1').respond(servedGene238Comment1Updated);
      $httpBackend.when('DELETE', '/api/genes/238/comments/1').respond(204, null);
      $httpBackend.when('POST', '/api/genes/238/suggested_changes').respond(200, servedGene238SuggestedChangeSubmitted);
      $httpBackend.when('POST', '/api/genes/238/suggested_changes/1/accept').respond(200, servedGene238SuggestedChangeAccepted);
      $httpBackend.when('POST', '/api/genes/238/suggested_changes/2/reject').respond(200, servedGene238SuggestedChangeAccepted);
      $httpBackend.when('GET', '/api/genes/238/suggested_changes').respond(200, servedGene238SuggestedChanges);
      $httpBackend.when('GET', '/api/genes/238/suggested_changes/1').respond(200, servedGene238SuggestedChange1);
      $httpBackend.when('GET', '/api/genes/238/revisions').respond(200, servedGene238Revisions);
      $httpBackend.when('GET', '/api/genes/238/revisions/1').respond(200, servedGene238Revisions1);
      $httpBackend.when('GET', '/api/genes/238/revisions/last').respond(200, servedGene238RevisionsLast);

      // instantiate GenesViewController using resolved deps from event.genes state
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      expect($state.$current.name).to.equal('events.genes.child');
      var deps  = $state.$current.parent.locals.globals;
      scope = $rootScope.$new(); // assign the controller's scope for easy access in tests
      GenesViewController = $controller('GenesViewController', {
        $scope: scope,
        Genes: deps.Genes,
        MyGeneInfo: deps.MyGeneInfo,
        gene: deps.gene,
        variants: deps.variants,
        variantGroups: deps.variantGroups,
        myGeneInfo: deps.myGeneInfo
      });

      expect(GenesViewController).to.exist;
      expect(GenesViewController).to.be.an('object');
      expect(scope.geneModel).to.exist;
      expect(scope.geneModel).to.be.an('object');

      // compile test child template
      elem = $compile($state.current.template)(scope);
      // elem = $(elem).find('entity-view');

      //expect($(elem)).to.have.attr('entity-model');

      viewScope  = elem.scope();
      expect(viewScope.geneModel).to.exist;
      expect(viewScope.geneModel).to.be.an('object');

      //elem.data('$GenesViewController', GenesViewController); // assign GenesViewController as controller for fake-ui-view
    });

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('entityView directive', function(){
    it('is successfully instantiated within the context of GeneViewController', function() {
      // expect(GenesViewController).to.exist;
    });
  });
});
