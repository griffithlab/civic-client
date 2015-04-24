(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(geneTalkRevisionsViewConfig)
    .controller('GeneTalkRevisionsViewController', GeneTalkRevisionsViewController);

  // @ngInject
  function geneTalkRevisionsViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.talk.revisions', {
        // abstract: true,
        url: '/revisions/:changeId',
        controller: 'GeneTalkRevisionsViewController',
        lastRevision: function(Genes,gene) {
          return Genes.getRevisions(gene.entrez_id);
        },
        templateUrl: 'app/views/events/genes/talk/GeneTalkRevisionsView.tpl.html',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Revisions"',
          navMode: 'sub'
        }
      })
      .state('events.genes.talk.revisions.summary', {
        url: '/summary',
        resolve: /* @ngInject */ {
          change: function(Genes, $stateParams) {
            return Genes.getChange({ geneId: $stateParams.geneId, changeId: $stateParams.changeId });
          },
          changeComments: function(Genes, $stateParams) {
            return Genes.getChangeComments({ geneId: $stateParams.geneId, changeId: $stateParams.changeId })
          },
          revisionData: function(change, changeComments) {
            return { change: change, changeComments: changeComments}
          }
        },
        controller: function($scope, revisionData, change, changeComments) {
          $scope.revisionData = revisionData;
        },
        template: '<entity-talk-revision-summary revision-data="revisionData"><p>ENTITY TALK REVISIONS SUMMARY</p></entity-talk-revision-summary>',
        data: {
          titleExp: '"Gene " + gene.entrez_name + " Comments"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function GeneTalkRevisionsViewController($scope,
                                           $state,
                                           // resolved resources
                                           lastRevision,
                                           // inherited resolved resources
                                           changes,
                                           revisions,
                                           Genes,
                                           gene) {
    console.log('GenesTalkController called.');
    var ctrl = $scope.ctrl = {};
    var geneTalkRevisionsModel = ctrl.geneTalkRevisionsModel = {};

    geneTalkRevisionsModel.config = {
      type: 'gene',
      name: gene.entrez_name,
      service: Genes,
      state: {
        baseState: 'events.genes.talk.revisions',
        baseUrl: $state.href('events.genes.talk.revisions', { geneId: gene.entrez_id })
      },
      styles: {
        view: {
          summaryBackgroundColor: 'pageBackground2',
          talkBackgroundColor: 'pageBackground'
        },
        tabs: {
          tabRowBackground: 'pageBackground2Gradient'
        }
      }
    };

    geneTalkRevisionsModel.data = {
      entity: gene,
      id: gene.entrez_id,
      parent: null,
      parentId: null,
      changes: changes,
      revisions: revisions,
      lastRevision: lastRevision
    };

    geneTalkRevisionsModel.actions = {
      getChanges: function() {
        return Genes.getChanges(gene.entrez_id)
          .then(function(response) {
            geneTalkRevisionsModel.data.changes = response;
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
            geneTalkRevisionsModel.data.revisions = response;
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
        return Genes.getLastRevision(gene.entrez_id)
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
