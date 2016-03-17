(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .config(variantGroupEditConfig)
    .factory('VariantGroupEditViewOptions', VariantGroupEditViewOptions)
    .controller('VariantGroupEditController', VariantGroupEditController);

  // @ngInject
  function variantGroupEditConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variantGroups.edit', {
        abstract: true,
        url: '/edit',
        templateUrl: 'app/views/events/variantGroups/edit/VariantGroupEditView.tpl.html',
        controller: 'VariantGroupEditController',
        controllerAs: 'vm',
        resolve: {
          VariantGroupRevisions: 'VariantGroupRevisions',
          initVariantGroupEdit: function(VariantGroups, VariantGroupRevisions, VariantGroupHistory, $stateParams, $q) {
            var variantGroupId = $stateParams.variantGroupId;
            return $q.all([
              VariantGroupRevisions.initRevisions(variantGroupId),
              VariantGroupRevisions.getPendingFields(variantGroupId),
              VariantGroupHistory.initBase(variantGroupId)
            ]);
          }
        },
        deepStateRedirect: [ 'variantGroupId' ],
        data: {
          titleExp: '"VariantGroup " + variant.name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.edit.basic', {
        url: '/basic',
        template: '<variant-group-edit-basic></variant-group-edit-basic>',
        data: {
          titleExp: '"VariantGroup Group " + variant.name + " Edit"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantGroupEditViewOptions($state, $stateParams) {
    var baseUrl = '';
    var baseState = '';
    var styles = {};

    function init() {
      this.state.baseState = 'events.genes.summary.variantGroups.edit';
      this.state.baseUrl = $state.href(this.state.baseUrl, $stateParams);

      angular.copy({
        view: {
          summaryBackgroundColor: 'pageBackground',
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
  function VariantGroupEditController(VariantGroups, VariantGroupRevisions, VariantGroupEditViewOptions) {
    console.log('VariantGroupEditController called.');
    VariantGroupEditViewOptions.init();
    this.VariantGroupEditViewModel = VariantGroups;
    this.VariantGroupRevisionsModel = VariantGroupRevisions;
    this.VariantGroupEditViewOptions = VariantGroupEditViewOptions;
  }

})();
