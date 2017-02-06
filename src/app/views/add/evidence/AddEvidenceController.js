(function() {
  'use strict';
  angular.module('civic.add.evidence')
    .config(AddEvidenceConfig)
    .factory('AddEvidenceViewOptions', AddEvidenceViewOptions)
    .controller('AddEvidenceController', AddEvidenceController);

  // @ngInject
  function AddEvidenceConfig($stateProvider) {
    $stateProvider
      .state('add.evidence', {
        abstract: true,
        url: '/evidence',
        templateUrl: 'app/views/add/evidence/AddEvidenceView.tpl.html',
        resolve: {
          Evidence: 'Evidence'
        },
        controller: 'AddEvidenceController',
        controllerAs: 'vm'
      })
      .state('add.evidence.basic', {
        url: '/basic?geneId&variantId&geneName&variantName&diseaseName&pubmedId&sourceSuggestionId&variantOrigin&evidenceType&evidenceDirection&evidenceLevel&clinicalSignificance',
        template: '<add-evidence-basic></add-evidence-basic>',
        data: {
          titleExp: '"Add Evidence"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function AddEvidenceViewOptions($state, $stateParams) {
    var state = {
      baseParams: {},
      baseState: '',
      baseUrl: ''
    };
    var styles = {};

    function init() {
      angular.copy($stateParams, this.state.baseParams);
      this.state.baseState = 'add.evidence';
      this.state.baseUrl = $state.href(this.state.baseState, $stateParams);

      angular.copy({
        view: {
          backgroundColor: 'pageBackground'
        }
      }, this.styles);
    }

    return {
      init: init,
      state: state,
      styles: styles
    };
  }

  // @ngInject
  function AddEvidenceController(Evidence, AddEvidenceViewOptions) {
    AddEvidenceViewOptions.init();
    this.type = 'EVIDENCE ITEM';
    // can get references to the view model and view options
    this.AddEvidenceViewModel = Evidence;
    this.AddEvidenceViewOptions = AddEvidenceViewOptions;
  }

})();
