(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .config(evidenceTalkRevisionsConfig)
    .factory('EvidenceTalkRevisionsViewOptions', EvidenceTalkRevisionsViewOptions)
    .controller('EvidenceTalkRevisionsController', EvidenceTalkRevisionsController);

  // @ngInject
  function evidenceTalkRevisionsConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.summary.evidence.talk.revisions', {
        abstract: true,
        url: '/revisions',
        templateUrl: 'app/views/events/evidence/talk/revisions/EvidenceTalkRevisionsView.tpl.html',
        controller: 'EvidenceTalkRevisionsController',
        controllerAs: 'vm',
        resolve: {
          EvidenceRevisions: 'EvidenceRevisions',
          EvidenceHistory: 'EvidenceHistory',
          initEvidenceTalkRevisions: function(Evidence, EvidenceRevisions, EvidenceHistory, $stateParams, $q) {
            var evidenceId = $stateParams.evidenceId;
            return $q.all([
              EvidenceRevisions.initRevisions(evidenceId),
              EvidenceHistory.initBase(evidenceId)
            ]);
          }
        },
        deepStateRedirect: [ 'evidenceId', 'revisionId' ],
        data: {
          titleExp: '"Evidence " + evidence.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.revisions.list', {
        url: '/list/:revisionId',
        template: '<evidence-talk-revisions></evidence-talk-revisions>',
        resolve: {
          initRevisionList: function(Evidence, EvidenceRevisions, EvidenceHistory, $stateParams) {
            return EvidenceRevisions.query($stateParams.evidenceId);
          }
        },
        data: {
          titleExp: '"Evidence " + evidence.name + " Revisions"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.revisions.list.summary', {
        url: '/summary',
        template: '<evidence-talk-revision-summary></evidence-talk-revision-summary>',
        resolve: {
          initRevision: function(EvidenceRevisions, $stateParams, $q) {
            return $q.all([
              EvidenceRevisions.get($stateParams.evidenceId, $stateParams.revisionId),
              EvidenceRevisions.queryComments($stateParams.evidenceId, $stateParams.revisionId)
            ]);
          }
        },
        data: {
          titleExp: '"Evidence " + evidence.name + " Revision Summary"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function EvidenceTalkRevisionsViewOptions($state, $stateParams) {
    var baseUrl = '';
    var baseState = '';
    var styles = {};

    function init() {
      baseState = 'events.genes.summary.variants.summary.evidence.talk.revisions';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy({
        view: {
          summaryBackgroundColor: 'pageBackground',
          talkBackgroundColor: 'pageBackground'
        },
        tabs: {
          tabRowBackground: 'pageBackground2Gradient'
        }
      }, styles);
    }

    return {
      init: init,
      state: {
        baseParams: $stateParams,
        baseState: baseState,
        baseUrl: baseUrl
      },
      styles: styles
    };
  }

  // @ngInject
  function EvidenceTalkRevisionsController(Evidence, EvidenceRevisions, EvidenceTalkRevisionsViewOptions) {
    console.log('EvidenceTalkRevisionsController called.');
    EvidenceTalkRevisionsViewOptions.init();
    this.EvidenceRevisionsModel = EvidenceRevisions;
    this.EvidenceTalkRevisionsViewOptions = EvidenceTalkRevisionsViewOptions;
  }

})();
