(function() {
  'use strict';
  angular.module('civic.events.genes')
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

    geneModel.config = {
      name: 'gene',
      state: 'events.genes'
    };

    geneModel.data = {
      gene: gene,
      comments: [],
      changes: [],
      revisions: [],
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

      submitChangeComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.submitChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Genes.updateChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(changeId) {
        return Genes.getChangeComments({geneId: gene.entrez_id, changeId: changeId})
          .then(function(response) {
            return response;
          })
      },
      getChangeComment: function(changeId, commentId) {
        return Genes.getChangeComment({
          geneId: gene.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },
      deleteChangeComment: function(changeId, commentId) {
        return Genes.deleteChangeComment({
          geneId: gene.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      getRevisions: function() {
        return Genes.getRevisions(gene.entrez_id)
          .then(function(response) {
            geneModel.data.revisions = response;
            return response;
          });
      },
      getRevision: function(revisionId) {
        return Genes.getRevision({ geneId: gene.entrez_id, revisionId: revisionId })
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function() {
        return Genes.getLastRevision({ geneId: gene.entrez_id })
          .then(function(response) {
            return response;
          });
      }
    };
  }

})();
