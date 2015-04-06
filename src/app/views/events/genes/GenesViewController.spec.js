'use strict';

describe('GenesViewController', function () {
  var $rootScope,
    $state,
    $controller,
    $httpBackend,
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
    module('served/gene238Variants.json');
    module('served/gene238VariantGroups.json');
    module('served/myGeneInfo238.json');
    module('served/gene238Comments.json');
    module('served/gene238Comment1.json');
    module('served/gene238Comment1Updated.json');
    module('civic.templates'); // load ng-html2js templates
    module('civic.events.genes', function ($provide, $stateProvider) {
      // GenesViewController is attached to an abstract state so we need to create parent and
      // child states of events.genes, then transition between then in order to force ui-router to instantiate it
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

    // inject services
    inject(function(_$rootScope_,
                    _$controller_,
                    _$state_,
                    _$httpBackend_,
                    servedGene238,
                    servedMyGeneInfo238,
                    servedGene238Variants,
                    servedGene238VariantGroups,
                    servedGene238Comments,
                    servedGene238Comment1,
                    servedGene238Comment1Updated) {
      $state = _$state_;
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;

      _ = window._;

      // setup mocked backend responses
      $httpBackend.when('GET', '/api/genes/238').respond(servedGene238);
      $httpBackend.when('GET', '/api/genes/mygene_info_proxy/238').respond(servedMyGeneInfo238);
      $httpBackend.when('GET', '/api/genes/238/variants').respond(servedGene238Variants);
      $httpBackend.when('GET', '/api/genes/238/variant_groups').respond(servedGene238VariantGroups);
      $httpBackend.when('GET', '/api/genes/238/comments').respond(servedGene238Comments);
      $httpBackend.when('GET', '/api/genes/238/comments/1').respond(servedGene238Comment1);
      $httpBackend.when('PATCH', '/api/genes/238/comments/1').respond(servedGene238Comment1Updated);
      $httpBackend.when('DELETE', '/api/genes/238/comments/1').respond(204, null);

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

    it('actions.refresh() should send a GET request to /api/genes/238', function() {
      $httpBackend.expect('GET', '/api/genes/238').respond('200', {});
      actions.refresh();
      $httpBackend.flush();
      // TODO mock 1st and 2nd calls returning gene238updated.json and test if the updated gene is returned and not the cached version
    });

    it('actions.update({ description: \'UPDATED DESCRIPTION\'}) should send a PUT request to /api/genes followed by a GET', function() {
      $httpBackend.expect('PATCH', '/api/genes', {
        geneId: 238,
        description: 'UPDATED DESCRIPTION'
      }).respond('200', {});
      $httpBackend.expect('GET', '/api/genes/238').respond('200', {});
      actions.update({ description: 'UPDATED DESCRIPTION' });
      $httpBackend.flush();
    });

  });

  describe('geneModel gene comment actions', function() {
    var actions;
    var geneModel;
    beforeEach(function() {
      geneModel = scope.geneModel;
      actions = geneModel.actions;
    });

    it('actions.getComments() should send a GET request to /api/genes/238/comments', function() {
      $httpBackend.expect('GET', '/api/genes/238/comments');
      actions.getComments();
      $httpBackend.flush();
    });

    it('actions.getComments() should attach new comment array to geneModel.data.comments', function() {
      var data = geneModel.data;
      $httpBackend.expect('GET', '/api/genes/238/comments');

      expect(data.comments).to.exist;
      expect(data.comments).to.be.an('array');
      expect(data.comments).to.be.empty;
      actions.getComments();

      $httpBackend.flush();

      expect(data.comments).to.not.be.empty;
      expect(data.comments[0].title).to.equal('Gene 238 Title 1');
    });

    it('actions.getComments() should eventually return an array of gene 238\'s comments', function() {
      $httpBackend.expect('GET', '/api/genes/238/comments');
      actions.getComments().then(function(comments) {
        expect(comments).to.be.an('array');
        expect(comments).to.not.be.empty;
        expect(comments[0].title).to.equal('Gene 238 Title 1');
      });
      $httpBackend.flush();
    });

    it('actions.getComment(1) should sent a GET request to \'/api/genes/238/comments/1\'.', function() {
      $httpBackend.expect('GET', '/api/genes/238/comments/1');
      actions.getComment(1);
      $httpBackend.flush();
    });

    it('actions.getComment(1) should eventually return gene 238\'s first comment', function() {
      $httpBackend.expect('GET', '/api/genes/238/comments/1');
      var firstComment = actions.getComment(1);
      firstComment.then(function(comment) {
        expect(comment.title).to.exist;
        expect(comment.title).to.be.a('string');
        expect(comment.title).to.equal('Gene 238 Title 1');
      });
      $httpBackend.flush();
    });

    it('actions.updateComment({commentId: 1, text:\'Gene 238 Comment 1 UPDATED\'}) should send a PATCH request to /api/genes/238/comments/1', function() {
      $httpBackend.expect('PATCH', '/api/genes/238/comments/1');
      actions.updateComment({ commentId: 1, text: 'Gene 238 Comment 1 UPDATED' });
      $httpBackend.flush();
    });

    it('actions.updateComment({commentId: 1, text:\'Gene 238 Comment 1 UPDATED\'}) should eventually return an updated comment record', function() {
      $httpBackend.expect('PATCH', '/api/genes/238/comments/1');
      actions.updateComment({
        commentId: 1,
        text: 'Gene 238 Comment 1 UPDATED'
      }).then(function(response) {
        expect(response.data.text).to.equal('Gene 238 Comment 1 UPDATED');
      });
      $httpBackend.flush();
    });

    it('actions.deleteComment(1) should send a DELETE request to /api/genes/238/1', function() {
      $httpBackend.expect('DELETE', '/api/genes/238/comments/1');
      actions.deleteComment(1);
      $httpBackend.flush();
    });

    it('actions.deleteComment(1) should eventually return a HTTP 204 response', function() {
      $httpBackend.expect('DELETE', '/api/genes/238/comments/1');
      actions.deleteComment(1).then(function(response) {
        expect(response.status).to.equal(204);
      });
      $httpBackend.flush();
    });
  });

  describe('geneModel gene changes actions', function() {
    var actions;
    var geneModel;
    beforeEach(function() {
      geneModel = scope.geneModel;
      actions = geneModel.actions;
    });

  });


});
