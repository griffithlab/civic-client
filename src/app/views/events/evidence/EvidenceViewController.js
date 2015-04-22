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
          route: 'events.genes.summary.variants.summary.evidence.talk.log',
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
      id: evidence.id,
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
        reqObj.evidenceId = evidence.id;
        Evidence.update(reqObj);
        this.refresh();
      },

      refresh: function () {
        Evidence.refresh(evidence.id)
          .then(function(response) {
            evidence = response;
            return response;
          })
      },
      submitChange: function(reqObj) {
        reqObj.evidenceId = evidence.id;
        return Evidence.submitChange(reqObj)
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(changeId) {
        return Evidence.acceptChange({ evidenceId: evidence.id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      }
    };
  }

})();
