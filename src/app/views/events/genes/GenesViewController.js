(function() {
  'use strict';
  angular.module('civic.events.genes', ['ui.router'])
    .config(GenesViewConfig)
    .controller('GenesViewController', GenesViewController);

  // @ngInject
  function GenesViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes', {
        abstract: true,
        url: '/genes/:geneId',
        templateUrl: 'app/views/events/genes/GenesView.tpl.html',
        resolve: /* @ngInject */ {
          Genes: 'Genes',
          MyGeneInfo: 'MyGeneInfo',
          gene: function(Genes, $stateParams) {
            return Genes.get($stateParams.geneId);
          },
          myGeneInfo: function(MyGeneInfo, gene) {
            return MyGeneInfo.get(gene.entrez_id);
          },
          variants: function(Genes, gene) {
            return Genes.getVariants(gene.entrez_id);
          },
          variantGroups: function(Genes, gene) {
            return Genes.getVariantGroups(gene.entrez_id)
          }
        },
        controller: 'GenesViewController',
        onExit: /* @ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      })
      .state('events.genes.summary', {
        url: '/summary',
        template: '<div><h1>Gene Summary</h1><pre>{{ geneModel.data | json}}</pre><ui-view/></div>',
        controller: function($scope) {
          console.log('events.gene.summary controller instantiated.');
          var ctrl = $scope;
        },
        data: {
          navMode: 'sub',
          titleExp: '"GENE SUMMARY TEST"'
        }
      });
    // additional events.genes states here
  }

  // @ngInject
  function GenesViewController($scope,
                               Genes,
                               MyGeneInfo,
                               gene,
                               variants,
                               variantGroups,
                               myGeneInfo) {

    var ctrl = $scope;
    var geneModel = ctrl.geneModel = {};
    var config = geneModel.config = {};
    var data = geneModel.data = {};
    var services = geneModel.service = {};
    var actions = geneModel.actions = {}

    geneModel.config = {
      name: 'gene',
      state: 'events.genes'
    };

    geneModel.data = {
      gene: gene,
      comments: [],
      changes: [],
      variants: variants,
      variantGroups: variantGroups,
      myGeneInfo: myGeneInfo
    };

    geneModel.services = {
      Genes: Genes,
      MyGeneInfo: MyGeneInfo
    };

    geneModel.actions = {
      get: function() {
        return gene;
      },

      update: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        Genes.update(reqObj);
        this.refresh();
      },

      refresh: function () {
        Genes.refresh(gene.entrez_id)
          .then(function(response) {
            gene = response;
            return response;
          })
      },

      getComments: function() {
        return Genes.getComments(gene.entrez_id)
          .then(function(response) {
            geneModel.data.comments = response;
            return response;
          });
      },

      getComment: function(commentId) {
        return Genes.getComment(gene.entrez_id, commentId);
      },

      submitComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.submitComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.updateComment(reqObj)
          .then(function(response){
            return response;
          });
      },

      deleteComment: function(commentId) {
        return Genes.deleteComment({ geneId: gene.entrez_id, commentId: commentId })
          .then(function(response) {
            return response;
          });
      },

      getChanges: function() {
        return Genes.getChanges(gene.entrez_id)
          .then(function(response) {
            geneModel.data.changes = response;
            return response;
          });
      },

      getChange: function(changeId) {
        return Genes.getChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      submitChange: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.submitChange(reqObj)
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(changeId) {
        return Genes.acceptChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      rejectChange: function(changeId) {
        return Genes.rejectChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      addChangeComment: function() {},
      updateChangeComment: function() {},
      getChangeComments: function() {},
      getChangeComment: function() {},
      deleteChangeComment: function() {},

      getRevisions: function() {},
      getRevision: function() {},
      getLastRevision: function() {}
    };
  }

})();
