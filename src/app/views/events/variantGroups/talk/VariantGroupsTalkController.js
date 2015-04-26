(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .config(variantGroupTalkViewConfig)
    .controller('VariantGroupTalkViewController', VariantGroupTalkViewController);

  // @ngInject
  function variantGroupTalkViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variantGroups.talk', {
        url: '/talk',
        templateUrl: 'app/views/events/variantGroups/talk/VariantGroupTalkView.tpl.html',
        controller: 'VariantGroupTalkViewController',
        resolve: {
          comments: function(VariantGroups, variantGroup) {
            return VariantGroups.getComments(variantGroup.id);
          },
          changes: function(VariantGroups, variantGroup) {
            return VariantGroups.getChanges(variantGroup.id);
          },
          revisions: function(VariantGroups, variantGroup) {
            return VariantGroups.getRevisions(variantGroup.id);
          },
          lastRevision: function(VariantGroups, variantGroup) {
            return VariantGroups.getLastRevision(variantGroup.id);
          }
        },
        deepStateRedirect: true,
        data: {
          titleExp: '"Variant " + variantGroup.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.talk.log', {
        url: '/log',
        template: '<variant-group-talk-log><p>VARIANT GROUP TALK LOG</p></variant-group-talk-log>',
        data: {
          titleExp: '"Variant " + variantGroup.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.talk.comments', {
        url: '/comments',
        template: '<variant-group-talk-comments></variant-group-talk-comments>',
        data: {
          titleExp: '"Variant " + variantGroup.name + " Comments"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantGroupTalkViewController($scope,
                                          $state,
                                          $stateParams,
                                          // resolved resources
                                          comments,
                                          changes,
                                          revisions,
                                          lastRevision,

                                          // inherited resolved resources
                                          Variants,
                                          VariantGroups,
                                          variantGroup,
                                          gene) {
    console.log('VariantsTalkController called.');
    var ctrl = $scope.ctrl = {};
    var variantGroupTalkModel = ctrl.variantGroupTalkModel = {};

    variantGroupTalkModel.config = {
      type: 'variant group',
      name: variantGroup.name,
      service: VariantGroups,
      state: {
        baseState: 'events.genes.summary.variantGroups.talk',
        baseUrl: $state.href('events.genes.summary.variantGroups.talk', $stateParams)
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
          heading: variantGroup.name + ' Log',
          route: 'events.genes.summary.variantGroups.talk.log',
          params: { geneId: gene.entrez_id, variantGroupId: variantGroup.id }
        },
        {
          heading: variantGroup.name + ' Comments',
          route: 'events.genes.summary.variantGroups.talk.comments',
          params: { geneId: gene.entrez_id, variantGroupId: variantGroup.id }
        },
        {
          heading: variantGroup.name + ' Revisions',
          route: 'events.genes.summary.variantGroups.talk.revisions',
          params: { geneId: gene.entrez_id, variantGroupId: variantGroup.id }
        }
      ]
    };

    variantGroupTalkModel.data = {
      entity: variantGroup,
      id: variantGroup.id,
      parent: gene,
      parentId: gene.entrez_id,
      comments: comments,
      changes: changes,
      revisions: revisions,
      lastRevision: lastRevision
    };

    variantGroupTalkModel.actions = {
      getComments: function() {
        return Variants.getComments(variantGroup.id)
          .then(function(response) {
            variantGroupTalkModel.data.comments = response;
            return response;
          });
      },

      getComment: function(commentId) {
        return Variants.getComment(variantGroup.id, commentId);
      },

      submitComment: function(reqObj) {
        reqObj.variantId = variantGroup.id;
        return Variants.submitComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateComment: function(reqObj) {
        reqObj.variantId = variantGroup.id;
        return Variants.updateComment(reqObj)
          .then(function(response){
            return response;
          });
      },

      deleteComment: function(commentId) {
        return Variants.deleteComment({ variantId: variantGroup.id, commentId: commentId })
          .then(function(response) {
            return response;
          });
      },

      getChanges: function() {
        return Variants.getChanges(variantGroup.id)
          .then(function(response) {
            variantGroupTalkModel.data.changes = response;
            return response;
          });
      },

      getChange: function(changeId) {
        return Variants.getChange({ variantId: variantGroup.id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      rejectChange: function(changeId) {
        return Variants.rejectChange({ variantId: variantGroup.id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      submitChangeComment: function(reqObj) {
        reqObj.variantId = variantGroup.id;
        return Variants.submitChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        reqObj.variantId = variantGroup.id;
        return Variants.updateChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(changeId) {
        return Variants.getChangeComments({variantId: variantGroup.id, changeId: changeId})
          .then(function(response) {
            return response;
          })
      },
      getChangeComment: function(changeId, commentId) {
        return Variants.getChangeComment({
          variantId: variantGroup.id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },
      deleteChangeComment: function(changeId, commentId) {
        return Variants.deleteChangeComment({
          variantId: variantGroup.id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      getRevisions: function() {
        return Variants.getRevisions(variantGroup.id)
          .then(function(response) {
            variantGroupTalkModel.data.revisions = response;
            return response;
          });
      },
      getRevision: function(revisionId) {
        return Variants.getRevision({ variantId: variantGroup.id, revisionId: revisionId })
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function() {
        return Variants.getLastRevision({ variantId: variantGroup.id })
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
