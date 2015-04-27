(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .config(evidenceTalkViewConfig)
    .controller('EvidenceTalkViewController', EvidenceTalkViewController);

  // @ngInject
  function evidenceTalkViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.summary.evidence.talk', {
        url: '/talk',
        templateUrl: 'app/views/events/evidence/talk/EvidenceTalkView.tpl.html',
        controller: 'EvidenceTalkViewController',
        resolve: {
          comments: function(Evidence, evidence) {
            return Evidence.getComments(evidence.id);
          },
          changes: function(Evidence, evidence) {
            return Evidence.getChanges(evidence.id);
          },
          revisions: function(Evidence, evidence) {
            return Evidence.getRevisions(evidence.id);
          },
          lastRevision: function(Evidence, evidence) {
            return Evidence.getLastRevision(evidence.id);
          }
        },
        deepStateRedirect: true,
        data: {
          titleExp: '"Evidence EID" + evidence.id + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.log', {
        url: '/log', // transition to events.genes.talk abstract state defaults to this state
        template: '<evidence-talk-log></evidence-talk-log>',
        data: {
          titleExp: '"Evidence EID" + evidence.id + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.comments', {
        url: '/comments',
        template: '<evidence-talk-comments></evidence-talk-comments>',
        data: {
          titleExp: '"Evidence EID" + evidence.id + " Comments"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.revisions', {
        url: '/revisions/:changeId',
        template: '<evidence-talk-revisions></evidence-talk-revisions>',
        data: {
          titleExp: '"Evidence " + gene.entrez_name + " Revisions"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.revisions.summary', {
        url: '/summary',
        template: '<evidence-talk-revision-summary></evidence-talk-revision-summary>',
        data: {
          titleExp: '"Evidence " + gene.entrez_name + " Revision Summary"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function EvidenceTalkViewController($scope,
                                      $state,
                                      $stateParams,

                                      // resolved resources
                                      comments,
                                      changes,
                                      revisions,
                                      lastRevision,

                                      // inherited resolved resources
                                      Evidence,
                                      gene,
                                      variant,
                                      evidence) {
    console.log('VariantsTalkController called.');
    var ctrl = $scope.ctrl = {};
    var evidenceTalkModel = ctrl.evidenceTalkModel = {};

    evidenceTalkModel.config = {
      type: 'evidence',
      name: evidence.id,
      service: Evidence,
      state: {
        baseState: 'events.genes.summary.variants.summary.evidence.talk',
        baseUrl: $state.href('events.genes.summary.variants.summary.evidence.talk', $stateParams)
      },
      styles: {
        view: {
          summaryBackgroundColor: 'pageBackground2',
          talkBackgroundColor: 'pageBackground'
        },
        tabs: {
          tabRowBackground: 'pageBackground2Gradient'
        }
      },
      tabData: [
        {
          heading: 'EID'+ evidence.id + ' Log',
          route: 'events.genes.summary.variants.summary.evidence.talk.log',
          params: { geneId: gene.entrez_id, variantId: variant.id, evidenceId: evidence.id }
        },
        {
          heading: 'EID'+ evidence.id + ' Comments',
          route: 'events.genes.summary.variants.summary.evidence.talk.comments',
          params: { geneId: gene.entrez_id, variantId: variant.id, evidenceId: evidence.id }
        },
        {
          heading: 'EID'+ evidence.id + ' Revisions',
          route: 'events.genes.summary.variants.summary.evidence.talk.revisions',
          params: { geneId: gene.entrez_id, variantId: variant.id, evidenceId: evidence.id }
        }
      ]
    };

    evidenceTalkModel.data = {
      entity: evidence,
      id: evidence.id,
      parent: variant,
      parentId: variant.id,
      comments: comments,
      changes: changes,
      change: {},
      changeComments: [],
      revisions: revisions,
      lastRevision: lastRevision
    };

    evidenceTalkModel.actions = {
      getComments: function() {
        return Evidence.getComments(evidence.id)
          .then(function(response) {
            evidenceTalkModel.data.comments = response;
            return response;
          });
      },

      getComment: function(commentId) {
        return Evidence.getComment(evidence.id, commentId);
      },

      submitComment: function(reqObj) {
        reqObj.evidenceId = evidence.id;
        return Evidence.submitComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateComment: function(reqObj) {
        reqObj.evidenceId = evidence.id;
        return Evidence.updateComment(reqObj)
          .then(function(response){
            return response;
          });
      },

      deleteComment: function(commentId) {
        return Evidence.deleteComment({ evidenceId: evidence.id, commentId: commentId })
          .then(function(response) {
            return response;
          });
      },

      getChanges: function() {
        return Evidence.getChanges(evidence.id)
          .then(function(response) {
            evidenceTalkModel.data.changes = response;
            return response;
          });
      },

      getChange: function(changeId) {
        return Evidence.getChange({ evidenceId: evidence.id, changeId: changeId })
          .then(function(response) {
            evidenceTalkModel.data.change = response;
            return response;
          })
      },

      rejectChange: function(changeId) {
        return Evidence.rejectChange({ evidenceId: evidence.id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      submitChangeComment: function(changeId, comment) {
        var reqObj = comment;
        reqObj.evidenceId = evidence.id;
        reqObj.changeId = changeId;
        return Evidence.submitChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        reqObj.evidenceId = evidence.id;
        return Evidence.updateChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(changeId) {
        return Evidence.getChangeComments({evidenceId: evidence.id, changeId: changeId})
          .then(function(response) {
            evidenceTalkModel.data.changeComments = response;
            return response;
          })
      },
      getChangeComment: function(changeId, commentId) {
        return Evidence.getChangeComment({
          evidenceId: evidence.id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },
      deleteChangeComment: function(changeId, commentId) {
        return Evidence.deleteChangeComment({
          evidenceId: evidence.id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      getRevisions: function() {
        return Evidence.getRevisions(evidence.id)
          .then(function(response) {
            evidenceTalkModel.data.revisions = response;
            return response;
          });
      },
      getRevision: function(revisionId) {
        return Evidence.getRevision({ evidenceId: evidence.id, revisionId: revisionId })
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function() {
        return Evidence.getLastRevision({ evidenceId: evidence.id })
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
