(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(variantTalkRevisionsViewConfig)
    .controller('VariantTalkRevisionsViewController', VariantTalkRevisionsViewController);

  // @ngInject
  function variantTalkRevisionsViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.talk.revisions', {
        // abstract: true,
        url: '/revisions/:changeId',
        controller: 'VariantTalkRevisionsViewController',
        lastRevision: function(Genes,gene) {
          return Variants.getRevisions(gene.entrez_id);
        },
        templateUrl: 'app/views/events/variants/talk/VariantTalkRevisionsView.tpl.html',
        data: {
          titleExp: '"Variant " + variant.name + " Revisions"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.revisions.summary', {
        url: '/summary',
        resolve: /* @ngInject */ {
          change: function(Genes, $stateParams) {
            return Variants.getChange({ geneId: $stateParams.geneId, changeId: $stateParams.changeId });
          },
          changeComments: function(Genes, $stateParams) {
            return Variants.getChangeComments({ geneId: $stateParams.geneId, changeId: $stateParams.changeId })
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
          titleExp: '"Variant " + variant.name + " Comments"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantTalkRevisionsViewController($scope,
                                              $state,
                                              $stateParams,
                                              // resolved resources
                                              lastRevision,
                                              // inherited resolved resources
                                              changes,
                                              revisions,
                                              Variants,
                                              variant,
                                              gene) {
    console.log('GenesTalkController called.');
    var ctrl = $scope.ctrl = {};
    var variantTalkRevisionsModel = ctrl.variantTalkRevisionsModel = {};

    variantTalkRevisionsModel.config = {
      type: 'variant',
      name: variant.id,
      service: Variants,
      state: {
        baseState: 'events.variants.summary.variants.talk.revisions',
        baseUrl: $state.href('events.variants.summary.variants.talk.revisions', { geneId: gene.entrez_id, variantId: variant.id })
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

    variantTalkRevisionsModel.data = {
      entity: variant,
      id: variant.id,
      parent: gene,
      parentId: gene.id,
      changes: changes,
      revisions: revisions,
      lastRevision: lastRevision,
      currentRevision: { // placeholder for /summary revision data
        comments: [],
        change: {}
      }
    };

    variantTalkRevisionsModel.actions = {
      getChanges: function() {
        return Variants.getChanges(gene.entrez_id)
          .then(function(response) {
            variantTalkRevisionsModel.data.changes = response;
            return response;
          });
      },

      getChange: function(changeId) {
        return Variants.getChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      submitChange: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Variants.submitChange(reqObj)
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(changeId) {
        return Variants.acceptChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      rejectChange: function(changeId) {
        return Variants.rejectChange({ geneId: gene.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      submitComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        reqObj.changeId = $stateParams.changeId;
        return Variants.submitChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateComment: function(reqObj) {
        reqObj.geneId = gene.entrez_id;
        return Variants.updateChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      getComments: function() {
        return Variants.getChangeComments({geneId: gene.entrez_id, changeId: $stateParams.changeId })
          .then(function(response) {
            console.log('getting change comments.');
            console.table(response);
            variantTalkRevisionsModel.data.currentRevision.comments = response;
            return response;
          })
      },

      getComment: function(changeId, commentId) {
        return Variants.getChangeComment({
          geneId: gene.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      deleteComment: function(changeId, commentId) {
        return Variants.deleteChangeComment({
          geneId: gene.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      getRevisions: function() {
        return Variants.getRevisions(gene.entrez_id)
          .then(function(response) {
            variantTalkRevisionsModel.data.revisions = response;
            return response;
          });
      },

      getRevision: function(revisionId) {
        return Variants.getRevision({ geneId: gene.entrez_id, revisionId: revisionId })
          .then(function(response) {
            return response;
          });
      },

      getLastRevision: function() {
        return Variants.getLastRevision(gene.entrez_id)
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
