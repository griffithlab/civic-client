'use strict';

describe('GenesViewController', function () {
  var $rootScope,
    $state,
    $controller,
    GenesService,
    Genes,
    MyGeneInfoService,
    MyGeneInfo,
    GenesViewController,
    scope,
    state = 'events.genes';

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
    module('served/myGeneInfo238.json');
    module('civic.events.genes', function ($provide, $stateProvider, servedGene238, servedMyGeneInfo238) {
      // set up mock service providers
      $provide.value('Genes', GenesService = {
        get: sinon.stub().withArgs({ geneId: 238 }).resolves(servedGene238)
      });
      $provide.value('MyGeneInfo', MyGeneInfoService = {
        get: sinon.stub().withArgs(238).resolves(servedMyGeneInfo238)
      });

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
                    _Genes_,
                    _MyGeneInfo_) {

      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $state = _$state_;
      Genes = _Genes_;
      MyGeneInfo = _MyGeneInfo_;

      _ = window._;

      sinonAsPromised($q);

      // ui-router state transition debugging
      //function message(to, toP, from, fromP) { return from.name  + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP); }
      //$rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) { console.log("Start:   " + message(to, toP, from, fromP)); });
      //$rootScope.$on("$stateChangeSuccess", function(evt, to, toP, from, fromP) { console.log("Success: " + message(to, toP, from, fromP)); });
      //$rootScope.$on("$stateChangeError", function(evt, to, toP, from, fromP, err) { console.log("Error:   " + message(to, toP, from, fromP), err); });

      // instantiate GenesViewController using resolved deps from event.genes state
      goFromState('initial').toState('events.genes.child', { geneId: 238 });
      // expect($state.$current.name).to.equal('events.genes.child');
      var deps  = $state.$current.parent.locals.globals;
      scope = $rootScope.$new();
      GenesViewController = $controller('GenesViewController', {
        $scope: scope,
        Genes: deps.Genes,
        MyGeneInfo: deps.MyGeneInfo,
        gene: deps.gene,
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
    it('provides data object on geneModel', function() {
      expect(scope.geneModel.data).to.exist;
      expect(scope.geneModel.data).to.be.an('object');
    });

    it('attaches gene data to geneModel data object', function() {
      expect(scope.geneModel.data.gene).to.exist;
      expect(scope.geneModel.data.gene).to.be.an('object');
      expect(Number(scope.geneModel.data.gene.entrez_id)).to.equal(238);
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

    it('attaches addGene function to geneModel actions object', function() {
      expect(scope.geneModel.actions.addGene).to.exist;
      expect(scope.geneModel.actions.addGene).to.be.a('function');
    });

    it('attaches refreshGene function to geneModel actions object', function() {
      expect(scope.geneModel.actions.refreshGene).to.exist;
      expect(scope.geneModel.actions.refreshGene).to.be.a('function');
    });

    it('attaches submitChange function to geneModel actions object', function() {
      expect(scope.geneModel.actions.submitChange).to.exist;
      expect(scope.geneModel.actions.submitChange).to.be.a('function');
    });

    it('attaches updateComment function to geneModel actions object', function() {
      expect(scope.geneModel.actions.updateComment).to.exist;
      expect(scope.geneModel.actions.updateComment).to.be.a('function');
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

    it('attaches addComment function to geneModel actions object', function() {
      expect(scope.geneModel.actions.addComment).to.exist;
      expect(scope.geneModel.actions.addComment).to.be.a('function');
    });

    it('attaches getComments function to geneModel actions object', function() {
      expect(scope.geneModel.actions.getComments).to.exist;
      expect(scope.geneModel.actions.getComments).to.be.a('function');
    });

    it('attaches deleteComment function to geneModel actions object', function() {
      expect(scope.geneModel.actions.deleteComment).to.exist;
      expect(scope.geneModel.actions.deleteComment).to.be.a('function');
    });
  });

  describe('geneModel gene actions', function() {


  });

  describe('geneModel gene changes actions', function() {


  });

  describe('geneModel gene comment actions', function() {


  });
});
