(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(variantTalkViewConfig)
    .controller('VariantTalkViewController', VariantTalkViewController);

  // @ngInject
  function variantTalkViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.talk', {
        url: '/talk',
        templateUrl: 'app/views/events/variants/talk/VariantTalkView.tpl.html',
        controller: 'VariantTalkViewController',
        resolve: {
          comments: function(Variants, variant) {
            return Variants.getComments(variant.id);
          },
          changes: function(Variants, variant) {
            return Variants.getChanges(variant.id);
          },
          revisions: function(Variants, variant) {
            return Variants.getRevisions(variant.id);
          },
          lastRevision: function(Variants, variant) {
            return Variants.getLastRevision(variant.id);
          }
        },
        deepStateRedirect: true,
        data: {
          titleExp: '"Variant " + variant.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.log', {
        url: '', // transition to events.genes.talk abstract state defaults to this state
        template: '<entity-talk-log entity-talk-model="ctrl.variantTalkModel"></entity-talk-log>',
        data: {
          titleExp: '"Variant " + variant.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.comments', {
        url: '/comments',
        template: '<entity-talk-comments entity-talk-model="ctrl.variantTalkModel"></entity-talk-comments>',
        data: {
          titleExp: '"Variant " + variant.name + " Comments"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.revisions', {
        url: '/revisions',
        template: '<entity-talk-revisions entity-talk-model="ctrl.variantTalkModel"></entity-talk-revisions>',
        data: {
          titleExp: '"Variant " + variant.name + " Revisions"',
          navMode: 'sub'
        }
      })
  }

  // @ngInject
  function VariantTalkViewController($scope,
                                     $state,

                                     // resolved resources
                                     comments,
                                     changes,
                                     revisions,
                                     lastRevision,

                                     // inherited resolved resources
                                     Variants,
                                     gene,
                                     variant,
                                     evidenceItems) {
    console.log('VariantsTalkController called.');
    var ctrl = $scope.ctrl = {};
    var variantTalkModel = ctrl.variantTalkModel = {};

    variantTalkModel.config = {
      type: 'variant',
      name: variant.name,
      service: Variants,
      state: {
        baseState: 'events.genes.summary.variants.talk',
        baseUrl: $state.href('events.genes.summary.variants.talk', { geneId: gene.entrez_id, variantId: variant.id })
      },
      styles: {
        view: {
          summaryBackgroundColor: 'pageBackground',
          talkBackgroundColor: 'pageBackground2'
        },
        tabs: {
          tabRowBackground: 'pageBackgroundGradient'
        }
      },
      tabData: [
        {
          heading: variant.name + ' Log',
          route: 'events.genes.summary.variants.talk.log',
          params: { geneId: gene.entrez_id, variantId: variant.id }
        },
        {
          heading: variant.name + ' Comments',
          route: 'events.genes.summary.variants.talk.comments',
          params: { geneId: gene.entrez_id, variantId: variant.id }
        },
        {
          heading: variant.name + ' Revisions',
          route: 'events.genes.summary.variants.talk.revisions',
          params: { geneId: gene.entrez_id, variantId: variant.id }
        }
      ]
    };

    variantTalkModel.data = {
      entity: variant,
      id: variant.id,
      parent: gene,
      parentId: gene.entrez_id,
      evidenceItems: evidenceItems,
      comments: comments,
      changes: changes,
      revisions: revisions,
      lastRevision: lastRevision
    };

    variantTalkModel.actions = {
      getComments: function() {
        return Variants.getComments(variant.id)
          .then(function(response) {
            variantTalkModel.data.comments = response;
            return response;
          });
      },

      getComment: function(commentId) {
        return Variants.getComment(variant.id, commentId);
      },

      submitComment: function(reqObj) {
        reqObj.variantId = variant.id;
        return Variants.submitComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateComment: function(reqObj) {
        reqObj.variantId = variant.id;
        return Variants.updateComment(reqObj)
          .then(function(response){
            return response;
          });
      },

      deleteComment: function(commentId) {
        return Variants.deleteComment({ variantId: variant.id, commentId: commentId })
          .then(function(response) {
            return response;
          });
      },

      getChanges: function() {
        return Variants.getChanges(variant.id)
          .then(function(response) {
            variantTalkModel.data.changes = response;
            return response;
          });
      },

      getChange: function(changeId) {
        return Variants.getChange({ variantId: variant.id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      rejectChange: function(changeId) {
        return Variants.rejectChange({ variantId: variant.id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      submitChangeComment: function(reqObj) {
        reqObj.variantId = variant.id;
        return Variants.submitChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        reqObj.variantId = variant.id;
        return Variants.updateChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(changeId) {
        return Variants.getChangeComments({variantId: variant.id, changeId: changeId})
          .then(function(response) {
            return response;
          })
      },
      getChangeComment: function(changeId, commentId) {
        return Variants.getChangeComment({
          variantId: variant.id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },
      deleteChangeComment: function(changeId, commentId) {
        return Variants.deleteChangeComment({
          variantId: variant.id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      getRevisions: function() {
        return Variants.getRevisions(variant.id)
          .then(function(response) {
            variantTalkModel.data.revisions = response;
            return response;
          });
      },
      getRevision: function(revisionId) {
        return Variants.getRevision({ variantId: variant.id, revisionId: revisionId })
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function() {
        return Variants.getLastRevision({ variantId: variant.id })
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
