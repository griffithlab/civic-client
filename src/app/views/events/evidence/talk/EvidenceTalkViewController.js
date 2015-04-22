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
        data: {
          titleExp: '"Evidence EID" + evidence.id + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.log', {
        url: '/log', // transition to events.genes.talk abstract state defaults to this state
        template: '<entity-talk-log entity-talk-model="ctrl.evidenceTalkModel"></entity-talk-log>',
        data: {
          titleExp: '"Evidence EID" + evidence.id + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.comments', {
        url: '/comments',
        template: '<entity-talk-comments entity-talk-model="ctrl.evidenceTalkModel"></entity-talk-comments>',
        data: {
          titleExp: '"Evidence EID" + evidence.id + " Comments"',
          navMode: 'sub'
        }
      })
      .state('epvents.genes.summary.variants.summary.evidence.talk.revisions', {
        url: '/revisions',
        template: '<entity-talk-revisions entity-talk-model="ctrl.evidenceTalkModel"></entity-talk-revisions>',
        data: {
          titleExp: '"Evidence EID" + evidence.id + " Revisions"',
          navMode: 'sub'
        }
      })
  }

  // @ngInject
  function EvidenceTalkViewController($scope,
                                      $state,

                                      // resolved resources
                                      comments,
                                      changes,
                                      revisions,
                                      lastRevision,

                                      // inherited resolved resources
                                      gene,
                                      variant,
                                      evidence) {
    console.log('VariantsTalkController called.');
    var ctrl = $scope.ctrl = {};
    var evidenceTalkModel = ctrl.evidenceTalkModel = {};

    evidenceTalkModel.config = {
      type: 'evidence',
      name: evidence.id,
      state: {
        baseState: 'events.genes.summary.variants.summary.evidence.talk',
        baseUrl: $state.href('events.genes.summary.variants.summary.evidence.talk', { geneId: gene.entrez_id, variantId: variant.id, evidenceId: evidence.id })
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
      revisions: revisions,
      lastRevision: lastRevision
    };
  }

})();
