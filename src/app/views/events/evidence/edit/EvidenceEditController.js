(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .config(evidenceEditConfig)
    .factory('EvidenceEditViewOptions', EvidenceEditViewOptions)
    .controller('EvidenceEditController', EvidenceEditController);

  // @ngInject
  function evidenceEditConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.evidence.edit', {
        abstract: true,
        url: '/edit',
        templateUrl: 'app/views/events/evidence/edit/EvidenceEditView.tpl.html',
        controller: 'EvidenceEditController',
        controllerAs: 'vm',
        resolve: {
          EvidenceRevisions: 'EvidenceRevisions',
          initEvidenceEdit: function(Evidence, EvidenceRevisions, EvidenceHistory, $stateParams, $q) {
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
          titleExp: '"Evidence " + evidence.name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.evidence.edit.basic', {
        url: '/basic',
        template: '<evidence-edit-basic></evidence-edit-basic>',
        data: {
          titleExp: '"Evidence " + evidence.name + " Edit"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function EvidenceEditViewOptions($state, $stateParams) {
    var baseUrl = '';
    var baseState = '';
    var styles = {};

    function init() {
      baseState = 'events.genes.summary.evidence.edit';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy({
        view: {
          summaryBackgroundColor: 'pageBackground2',
          editBackgroundColor: 'pageBackground',
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
  function EvidenceEditController(Evidence, EvidenceRevisions, EvidenceEditViewOptions) {
    console.log('EvidenceEditController called.');
    EvidenceEditViewOptions.init();
    this.EvidenceEditViewModel = Evidence; // we're re-using the Evidence model here but could in the future have a EvidenceEdit model if warranted
    this.EvidenceRevisionsModel = EvidenceRevisions;
    this.EvidenceEditViewOptions = EvidenceEditViewOptions;
  }

})();
