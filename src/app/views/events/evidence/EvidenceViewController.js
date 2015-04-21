(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .config(EvidenceViewConfig)
    .controller('EvidenceViewController', EvidenceViewController);

  // @ngInject
  function EvidenceViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.summary.evidence', {
        abstract: true,
        url: '/evidence/:evidenceId',
        templateUrl: 'app/views/events/evidence/EvidenceView.tpl.html',
        resolve: /* @ngInject */ {
          Evidence: 'Evidence',
          evidence: function(Evidence, $stateParams) {
            return Evidence.get($stateParams.evidenceId);
          }
        },
        controller: 'EvidenceViewController',
        deepStateRedirect: { params: ['evidenceId'] }
      })
      .state('events.genes.summary.variants.summary.evidence.summary', {
        url: '/summary',
        template: '<evidence-summary></evidence-summary>',
        data: {
          navMode: 'sub',
          titleExp: '"Evidence EID" + evidence.id'
        }
      });
  }

  // @ngInject
  function EvidenceViewController($scope,
                                  $state,
                                  // resolved assets
                                  Evidence,
                                  evidence,
                                  // inherited resolved assets
                                  gene,
                                  variant) {
    var ctrl,
      evidenceModel;

    ctrl = $scope;
    evidenceModel = ctrl.evidenceModel = {};

    evidenceModel.config = {
      type: 'evidence',
      name: 'EID' + evidence.id,
      state: {
        baseState: 'events.genes.summary.evidences.summary.evidence',
        baseUrl: $state.href('events.genes.summary.evidences.summary.evidence', {
          geneId: gene.entrez_id,
          variantId: variant.id,
          evidenceId: evidence.id
        })
      },
      tabData: [
        {
          heading: 'Evidence Summary',
          route: 'events.genes.summary.variants.summary.evidence.summary',
          params: { geneId: gene.entrez_id, variantId: variant.id, evidenceId: evidence.id }
        },
        {
          heading: 'Evidence Talk',
          route: 'events.genes.summary.variants.summary.evidence.talk',
          params: { geneId: gene.entrez_id, variantId: variant.id, evidenceId: evidence.id }
        }
      ],
      styles: {
        view: {
          backgroundColor: 'pageBackground2',
          foregroundColor: 'pageBackground'
        }
      }
    };

    evidenceModel.data = {
      // required entity data fields
      entity: evidence,
      id: evidence.entrez_id,
      parent: variant,
      parentId: variant.id,
      comments: [],
      changes: [],
      revisions: [],

      parentEntities: {
        gene: gene,
        variant: variant
      }

      // additional entity data fields
    };

    evidenceModel.services = {
      Evidence: Evidence
    };

    evidenceModel.actions = {
      get: function() {
        return evidence;
      },

      update: function(reqObj) {
        reqObj.evidenceId = evidence.entrez_id;
        Evidence.update(reqObj);
        this.refresh();
      },

      refresh: function () {
        Evidence.refresh(evidence.entrez_id)
          .then(function(response) {
            evidence = response;
            return response;
          })
      },

      getComments: function() {
        return Evidence.getComments(evidence.entrez_id)
          .then(function(response) {
            evidenceModel.data.comments = response;
            return response;
          });
      },

      getComment: function(commentId) {
        return Evidence.getComment(evidence.entrez_id, commentId);
      },

      submitComment: function(reqObj) {
        reqObj.evidenceId = evidence.entrez_id;
        return Evidence.submitComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateComment: function(reqObj) {
        reqObj.evidenceId = evidence.entrez_id;
        return Evidence.updateComment(reqObj)
          .then(function(response){
            return response;
          });
      },

      deleteComment: function(commentId) {
        return Evidence.deleteComment({ evidenceId: evidence.entrez_id, commentId: commentId })
          .then(function(response) {
            return response;
          });
      },

      getChanges: function() {
        return Evidence.getChanges(evidence.entrez_id)
          .then(function(response) {
            evidenceModel.data.changes = response;
            return response;
          });
      },

      getChange: function(changeId) {
        return Evidence.getChange({ evidenceId: evidence.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      submitChange: function(reqObj) {
        reqObj.evidenceId = evidence.entrez_id;
        return Evidence.submitChange(reqObj)
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(changeId) {
        return Evidence.acceptChange({ evidenceId: evidence.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      rejectChange: function(changeId) {
        return Evidence.rejectChange({ evidenceId: evidence.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      submitChangeComment: function(reqObj) {
        reqObj.evidenceId = evidence.entrez_id;
        return Evidence.submitChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        reqObj.evidenceId = evidence.entrez_id;
        return Evidence.updateChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(changeId) {
        return Evidence.getChangeComments({evidenceId: evidence.entrez_id, changeId: changeId})
          .then(function(response) {
            return response;
          })
      },
      getChangeComment: function(changeId, commentId) {
        return Evidence.getChangeComment({
          evidenceId: evidence.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },
      deleteChangeComment: function(changeId, commentId) {
        return Evidence.deleteChangeComment({
          evidenceId: evidence.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      getRevisions: function() {
        return Evidence.getRevisions(evidence.entrez_id)
          .then(function(response) {
            evidenceModel.data.revisions = response;
            return response;
          });
      },
      getRevision: function(revisionId) {
        return Evidence.getRevision({ evidenceId: evidence.entrez_id, revisionId: revisionId })
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function() {
        return Evidence.getLastRevision({ evidenceId: evidence.entrez_id })
          .then(function(response) {
            return response;
          });
      }
    };
  }

})();
