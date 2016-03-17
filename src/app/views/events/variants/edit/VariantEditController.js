(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(variantEditConfig)
    .factory('VariantEditViewOptions', VariantEditViewOptions)
    .controller('VariantEditController', VariantEditController);

  // @ngInject
  function variantEditConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.edit', {
        abstract: true,
        url: '/edit',
        templateUrl: 'app/views/events/variants/edit/VariantEditView.tpl.html',
        controller: 'VariantEditController',
        controllerAs: 'vm',
        resolve: {
          VariantRevisions: 'VariantRevisions',
          initVariantEdit: function(Variants, VariantRevisions, VariantHistory, $stateParams, $q) {
            var variantId = $stateParams.variantId;
            return $q.all([
              VariantRevisions.initRevisions(variantId),
              VariantRevisions.getPendingFields(variantId),
              VariantHistory.initBase(variantId)
            ]);
          }
        },
        deepStateRedirect: [ 'variantId' ],
        data: {
          titleExp: '"Variant " + variant.name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.edit.basic', {
        url: '/basic',
        template: '<variant-edit-basic></variant-edit-basic>',
        data: {
          titleExp: '"Variant " + variant.name + " Edit"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantEditViewOptions($state, $stateParams) {
    var baseUrl = '';
    var baseState = '';
    var styles = {};

    function init() {
      this.state.baseState = 'events.genes.summary.variants.edit';
      this.state.baseUrl = $state.href(this.state.baseUrl, $stateParams);

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
  function VariantEditController(Variants, VariantRevisions, VariantEditViewOptions) {
    console.log('VariantEditController called.');
    VariantEditViewOptions.init();
    this.VariantEditViewModel = Variants; // we're re-using the Variants model here but could in the future have a VariantEdit model if warranted
    this.VariantRevisionsModel = VariantRevisions;
    this.VariantEditViewOptions = VariantEditViewOptions;
  }

})();
