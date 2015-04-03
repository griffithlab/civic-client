'use strict';

describe('GenesViewController', function () {
  var $rootScope,
    $state,
    $controller,
    $httpBackend,

    Genes,
    MyGeneInfo,
    GenesViewController,

    scope,
    state = 'events.genes',

    servedGene238,
    servedGene238Variants,
    servedGene238VariantGroups,
    servedMyGeneInfo238;


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
    module('civic.services');
    module('civic.events');
    module('served/gene238.json');
    module('served/gene238Variants.json');
    module('served/myGeneInfo238.json');
    module('civic.events.genes', function ($provide, $stateProvider) {
      // set up mock service providers
      //$provide.value('Genes', {
      //  get: sinon.stub().withArgs({ geneId: 238 }).resolves(servedGene238)
      //});
      //$provide.value('MyGeneInfo', {
      //  get: sinon.stub().withArgs(238).resolves(servedMyGeneInfo238)
      //});

      // create a navigable initial and child states to force events.genes abstract state to resolve
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
          template: '<ui-view/>'
        })
    });

    module('q-constructor'); // switch to v1.3 $q constructor for sinon-as-promised
    module('civic.templates'); // load ng-html2js templates

    // inject services
    inject(function(_$rootScope_,
                    _$controller_,
                    _$state_,
                    $q,
                    _$httpBackend_,
                    _Genes_,
                    _MyGeneInfo_,
                    servedGene238,
                    servedMyGeneInfo238) {

      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $state = _$state_;
      $httpBackend = _$httpBackend_;
      Genes = _Genes_;
      MyGeneInfo = _MyGeneInfo_;

      _ = window._;

      sinonAsPromised($q);

      $httpBackend.when('GET', '/api/genes/238').respond(servedGene238);
      $httpBackend.when('GET', '/api/genes/mygene_info_proxy/238').respond(servedMyGeneInfo238);
      $httpBackend.when('GET', '/api/genes/238/variants').respond(servedGene238Variants);
      $httpBackend.when('GET', '/api/genes/238/variants_groups').respond(servedGene238VariantGroups);

      // ui-router state transition debugging
      //function message(to, toP, from, fromP) { return from.name  + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP); }
      //$rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) { console.log("Start:   " + message(to, toP, from, fromP)); });
      //$rootScope.$on("$stateChangeSuccess", function(evt, to, toP, from, fromP) { console.log("Success: " + message(to, toP, from, fromP)); });
      //$rootScope.$on("$stateChangeError", function(evt, to, toP, from, fromP, err) { console.log("Error:   " + message(to, toP, from, fromP), err); });

      // instantiate GenesViewController using resolved deps from event.genes state
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      $httpBackend.flush();
      expect($state.$current.name).to.equal('events.genes.child');
      var deps  = $state.$current.parent.locals.globals;
      scope = $rootScope.$new();
      GenesViewController = $controller('GenesViewController', {
        $scope: scope,
        Genes: deps.Genes,
        MyGeneInfo: deps.MyGeneInfo,
        gene: deps.gene,
        variants: deps.variants,
        variantGroups: deps.variantGroups,
        myGeneInfo: deps.myGeneInfo
      });

    });

  });

  describe('controller instantiation', function(){
    it('is successfully instantiated using resolved state dependencies', function() {
      expect(GenesViewController).to.exist;
    });
  });

  describe('geneModel object definition', function() {
    it('creates a geneModel object on $scope to hold state info, data, servies, and actions', function () {
      expect(scope.geneModel).to.exist;
      expect(scope.geneModel).to.be.an('object');
    });
  });

  describe('geneModel config', function() {
    it('specifies entity name and state name on config object', function() {
      expect(scope.geneModel.config).to.exist;
      expect(scope.geneModel.config.name).to.equal('gene');
      expect(scope.geneModel.config.state).to.equal('events.genes');
    });

  });

  describe('geneModel services', function() {
    it('provides Genes service on geneModel', function() {
      expect(scope.geneModel.services.Genes).to.exist;
      expect(scope.geneModel.services.Genes.get).to.be.a('function');
    });

    it('provides MyGeneInfo service on geneModel', function() {
      expect(scope.geneModel.services.MyGeneInfo).to.exist;
      expect(scope.geneModel.services.MyGeneInfo.get).to.be.a('function');
    });
  });

  describe('geneModel data', function() {
    var data;
    beforeEach(function() {
      data = scope.geneModel.data;
    });
    it('provides data object on geneModel', function() {
      expect(data).to.exist;
      expect(data).to.be.an('object');
    });

    it('provides gene data object', function() {
      expect(data.gene).to.exist;
      expect(data.gene).to.be.an('object');
      expect(Number(data.gene.entrez_id)).to.equal(238);
    });

    it('provides variants data object', function() {
      expect(data.variants).to.exist;
      expect(data.variants).to.be.an('array');
    });

    it('provides variant groups data object', function() {
      expect(data.variants).to.exist;
      expect(data.variants).to.be.an('array');
    });

    it('attaches myGeneInfo data to geneModel data object', function() {
      expect(scope.geneModel.data.myGeneInfo).to.exist;
      expect(scope.geneModel.data.myGeneInfo).to.be.an('object');
      expect(Number(scope.geneModel.data.myGeneInfo._id)).to.equal(238);
    });
  });

  describe('geneModel actions definitions', function() {
    it('provides actions object on geneModel', function() {
      expect(scope.geneModel.actions).to.exist;
      expect(scope.geneModel.actions).to.be.an('object');
    });

    // gene
    it('attaches update function to geneModel actions object', function() {
      expect(scope.geneModel.actions.update).to.exist;
      expect(scope.geneModel.actions.update).to.be.a('function');
    });

    it('attaches refresh function to geneModel actions object', function() {
      expect(scope.geneModel.actions.refresh).to.exist;
      expect(scope.geneModel.actions.refresh).to.be.a('function');
    });

    // comments
    it('attaches addComment function to geneModel actions object', function() {
      expect(scope.geneModel.actions.addComment).to.exist;
      expect(scope.geneModel.actions.addComment).to.be.a('function');
    });

    it('attaches getComments function to geneModel actions object', function() {
      expect(scope.geneModel.actions.getComments).to.exist;
      expect(scope.geneModel.actions.getComments).to.be.a('function');
    });

    it('attaches getComment function to geneModel actions object', function() {
      expect(scope.geneModel.actions.getComment).to.exist;
      expect(scope.geneModel.actions.getComment).to.be.a('function');
    });

    it('attaches deleteComment function to geneModel actions object', function() {
      expect(scope.geneModel.actions.deleteComment).to.exist;
      expect(scope.geneModel.actions.deleteComment).to.be.a('function');
    });

    it('attaches updateComment function to geneModel actions object', function() {
      expect(scope.geneModel.actions.updateComment).to.exist;
      expect(scope.geneModel.actions.updateComment).to.be.a('function');
    });

    // changes
    it('attaches submitChange function to geneModel actions object', function() {
      expect(scope.geneModel.actions.submitChange).to.exist;
      expect(scope.geneModel.actions.submitChange).to.be.a('function');
    });

    it('attaches getChanges function to geneModel actions object', function() {
      expect(scope.geneModel.actions.getChanges).to.exist;
      expect(scope.geneModel.actions.getChanges).to.be.a('function');
    });

    it('attaches applyChange function to geneModel actions object', function() {
      expect(scope.geneModel.actions.applyChange).to.exist;
      expect(scope.geneModel.actions.applyChange).to.be.a('function');
    });

    it('attaches acceptChange function to geneModel actions object', function() {
      expect(scope.geneModel.actions.acceptChange).to.exist;
      expect(scope.geneModel.actions.acceptChange).to.be.a('function');
    });

    it('attaches rejectChange function to geneModel actions object', function() {
      expect(scope.geneModel.actions.rejectChange).to.exist;
      expect(scope.geneModel.actions.rejectChange).to.be.a('function');
    });

    // revisions
    it('attaches getRevisions function to geneModel actions object', function() {
      expect(scope.geneModel.actions.getRevisions).to.exist;
      expect(scope.geneModel.actions.getRevisions).to.be.a('function');
    });

    it('attaches getRevision function to geneModel actions object', function() {
      expect(scope.geneModel.actions.getRevision).to.exist;
      expect(scope.geneModel.actions.getRevision).to.be.a('function');
    });

    it('attaches getLastRevision function to geneModel actions object', function() {
      expect(scope.geneModel.actions.getLastRevision).to.exist;
      expect(scope.geneModel.actions.getLastRevision).to.be.a('function');
    });

  });

  describe('geneModel gene actions', function() {
    var actions;
    var geneModel;
    beforeEach(function() {
      geneModel = scope.geneModel;
      actions = geneModel.actions;
    });

    it('actions.get() should return the gene data object', function() {
      expect(actions.get()).to.equal(geneModel.data.gene);
    });

    it('actions.update({ description: \'UPDATED DESCRIPTION\'}) should send a PUT request to /api/genes followed by a GET', function() {
      $httpBackend.expect('PATCH', '/api/genes').respond('200', {});
      $httpBackend.expect('GET', '/api/genes/238').respond('200', {});
      actions.update({ description: 'UPDATED DESCRIPTION' });
      $httpBackend.flush();
    });

    it('actions.delete() should send a DELETE request to /api/genes/238', function() {
      $httpBackend.expect('DELETE', '/api/genes/238').respond('200', {});
      actions.delete(238);
      $httpBackend.flush();
    });

    it('actions.refresh() should send a GET request to /api/genes/238', function() {
      $httpBackend.expect('GET', '/api/genes/238').respond('200', {});
      actions.refresh();
      $httpBackend.flush();
      // TODO mock 1st and 2nd calls returning gene238updated.json and test if the updated gene is returned and not the cached version
    });

  });

  describe('geneModel gene changes actions', function() {


  });

  describe('geneModel gene comment actions', function() {


  });
});
