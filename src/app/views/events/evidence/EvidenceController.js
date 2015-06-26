(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .config(EvidenceConfig)
    .factory('EvidenceViewOptions', EvidenceViewOptions)
    .controller('EvidenceController', EvidenceController);

  // @ngInject
  function EvidenceConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.summary.evidence', {
        abstract: true,
        url: '/evidence/:evidenceId',
        templateUrl: 'app/views/events/evidence/EvidenceView.tpl.html',
        resolve: /* @ngInject */ {
          Evidence: 'Evidence',
          initEvidence: function(Evidence, $stateParams) {
            return Evidence.initBase($stateParams.evidenceId);
          }

        },
        controller: 'EvidenceController',
        controllerAs: 'vm',
        deepStateRedirect: { params: ['evidenceId'] }
      })
      .state('events.genes.summary.variants.summary.evidence.summary', {
        url: '/summary',
        template: '<evidence-summary show-evidence-grid="true"></evidence-summary>',
        //resolve: {
        //  refreshEvidence: function(Evidence, $stateParams) {
        //    return Evidence.getFresh($stateParams.geneId);
        //  }
        //},
        // deepStateRedirect: { params: ['evidenceId'] },
        data: {
          navMode: 'sub',
          titleExp: '"Evidence " + evidence.name'
        }
      });
  }

  // @ngInject
  function EvidenceViewOptions($state, $stateParams) {
    var tabData = [];
    var state = {
      baseParams: {},
      baseState: '',
      baseUrl: ''
    };
    var styles = {};

    function init() {
      angular.copy($stateParams, this.state.baseParams);
      this.state.baseState = 'events.genes.summary.variants.summary.evidence';
      this.state.baseUrl = $state.href(this.state.baseState, $stateParams);

      angular.copy([
        {
          heading: 'Evidence Summary',
          route: 'events.genes.summary.variants.summary.evidence.summary',
          params: $stateParams
        },
        {
          heading: 'Evidence Talk',
          route: 'events.genes.summary.variants.summary.evidence.talk.log',
          params: $stateParams
        }
      ], this.tabData);

      angular.copy({
        view: {
          backgroundColor: 'pageBackground2'
        },
        edit: {
          summaryBackgroundColor: 'pageBackground2'
        }
      }, this.styles);
    }

    return {
      init: init,
      state: state,
      tabData: tabData,
      styles: styles
    };
  }

  // @ngInject
  function EvidenceController(Evidence, EvidenceViewOptions) {
    EvidenceViewOptions.init();
    // these will be passed to the entity-view directive controller, to be required by child entity component so that they
    // can get references to the view model and view options
    this.EvidenceViewModel = Evidence;
    this.EvidenceViewOptions = EvidenceViewOptions;
  }

})();
