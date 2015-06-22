(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(VariantsConfig)
    .factory('VariantsViewOptions', VariantsViewOptions)
    .controller('VariantsController', VariantsController);

  // @ngInject
  function VariantsConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants', {
        abstract: true,
        url: '/variants/:variantId',
        templateUrl: 'app/views/events/variants/VariantsView.tpl.html',
        resolve: /* @ngInject */ {
          Variants: 'Variants',
          initVariant: function(Variants, $stateParams) {
            return Variants.initBase($stateParams.variantId);
          }

        },
        controller: 'VariantsController',
        controllerAs: 'vm',
        deepStateRedirect: { params: ['variantId'] }
      })
      .state('events.genes.summary.variants.summary', {
        url: '/summary',
        template: '<variant-summary show-evidence-grid="true"></variant-summary>',
        resolve: {
          refreshVariant: function(Variants, $stateParams) {
            return Variants.get($stateParams.variantId);
          }
        },
        // deepStateRedirect: { params: ['variantId'] },
        data: {
          navMode: 'sub',
          titleExp: '"Variant " + variant.name'
        }
      });
  }

  // @ngInject
  function VariantsViewOptions($state, $stateParams) {
    var tabData = [];
    var state = {
      baseParams: {},
      baseState: '',
      baseUrl: ''
    };
    var styles = {};

    function init() {
      angular.copy($stateParams, this.state.baseParams);
      this.state.baseState = 'events.genes.summary.variants';
      this.state.baseUrl = $state.href(this.state.baseState, $stateParams);

      angular.copy([
        {
          heading: 'Variant Summary',
          route: 'events.genes.summary.variants.summary',
          params: $stateParams
        },
        {
          heading: 'Variant Talk',
          route: 'events.genes.summary.variants.talk.log',
          params: $stateParams
        }
      ], this.tabData);

      angular.copy({
        view: {
          backgroundColor: 'pageBackground'
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
  function VariantsController(Variants, VariantsViewOptions) {
    VariantsViewOptions.init();
    // these will be passed to the entity-view directive controller, to be required by child entity component so that they
    // can get references to the view model and view options
    this.VariantsViewModel = Variants;
    this.VariantsViewOptions = VariantsViewOptions;
  }

})();
