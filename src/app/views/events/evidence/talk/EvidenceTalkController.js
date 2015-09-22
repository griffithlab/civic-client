(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .config(evidenceTalkConfig)
    .factory('EvidenceTalkViewOptions', EvidenceTalkViewOptions)
    .controller('EvidenceTalkController', EvidenceTalkController);

  // @ngInject
  function evidenceTalkConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.summary.evidence.talk', {
        abstract: true,
        url: '/talk',
        templateUrl: 'app/views/events/evidence/talk/EvidenceTalkView.tpl.html',
        controller: 'EvidenceTalkController',
        controllerAs: 'vm',
        resolve: {
          EvidenceRevisions: 'EvidenceRevisions',
          EvidenceHistory: 'EvidenceHistory',
          initEvidenceTalk: function(Evidence, EvidenceRevisions, EvidenceHistory, $stateParams, $cacheFactory, $q) {
            var evidenceId = $stateParams.evidenceId;
            return $q.all([
              Evidence.initComments(evidenceId),
              EvidenceRevisions.initRevisions(evidenceId),
              EvidenceHistory.initBase(evidenceId)
            ]);
          }
        },
        deepStateRedirect: [ 'evidenceId' ],
        data: {
          titleExp: '"Evidence " + evidence.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.log', {
        url: '/log',
        template: '<evidence-talk-log></evidence-talk-log>',
        data: {
          titleExp: '"Evidence " + evidence.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.summary.evidence.talk.comments', {
        url: '/comments',
        template: '<evidence-talk-comments></evidence-talk-comments>',
        data: {
          titleExp: '"Evidence " + evidence.name + " Comments"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function EvidenceTalkViewOptions($state, $stateParams, Evidence) {
    var baseUrl = '';
    var baseState = '';
    var tabData = [];
    var styles = {};

    var evidence = Evidence.data.item;

    function init() {
      baseState = 'events.genes.summary.variants.summary.evidence.talk';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy([
        {
          heading: evidence.name + ' Revisions',
          route: baseState + '.revisions.list',
          params: { evidenceId: evidence.id }
        },
        {
          heading: evidence.name  + ' Comments',
          route: baseState + '.comments',
          params: { evidenceId: evidence.id }
        },
        {
          heading: evidence.name + ' Log',
          route: baseState + '.log',
          params: { evidenceId: evidence.id }
        }
      ], tabData);

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
      tabData: tabData,
      styles: styles
    };
  }

  // @ngInject
  function EvidenceTalkController(Evidence, EvidenceRevisions, EvidenceTalkViewOptions) {
    console.log('EvidenceTalkController called.');
    EvidenceTalkViewOptions.init();
    this.EvidenceTalkViewModel = Evidence; // we're re-using the Evidence model here but could in the future have a EvidenceTalk model if warranted
    this.EvidenceRevisionsModel = EvidenceRevisions;
    this.EvidenceTalkViewOptions = EvidenceTalkViewOptions;
  }

})();
