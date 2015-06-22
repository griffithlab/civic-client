(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .config(VariantGroupsConfig)
    .factory('VariantGroupsViewOptions', VariantGroupsViewOptions)
    .controller('VariantGroupsController', VariantGroupsController);

  // @ngInject
  function VariantGroupsConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variantGroups', {
        abstract: true,
        url: '/variantGroups/:variantGroupId',
        templateUrl: 'app/views/events/variantGroups/variantGroupsView.tpl.html',
        resolve: /* @ngInject */ {
          VariantGroups: 'VariantGroups',
          initVariantGroups: function(VariantGroups, $stateParams) {
            return VariantGroups.initBase($stateParams.variantGroupId);
          }
        },
        controller: 'VariantGroupsController',
        controllerAs: 'vm',
        deepStateRedirect: [ 'variantGroupId' ],
        onExit: /* @ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      })
      .state('events.genes.summary.variantGroups.summary', {
        url: '/summary',
        template: '<variant-group-summary show-variant-grid="true"></variant-group-summary>',
        resolve: {
          VariantGroups: 'VariantGroups',
          refreshVariantGroups: function(VariantGroups, $stateParams) {
            return VariantGroups.get($stateParams.variantGroupId);
          }
        },
        deepStateRedirect: [ 'variantGroupId' ],
        data: {
          titleExp: '"VariantGroups " + variantGroup.name + " Summary"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantGroupsViewOptions($state, $stateParams, VariantGroups) {
    var tabData = [];
    var state = {
      baseParams: {},
      baseState: '',
      baseUrl: ''
    };
    var styles = {};

    function init() {
      angular.copy($stateParams, this.state.baseParams);
      this.state.baseState = 'events.genes.summary.variantGroups';
      this.state.baseUrl = $state.href(this.state.baseState, $stateParams);

      angular.copy([
        {
          heading: 'Variant Group Summary',
          route: 'events.genes.summary.variantGroups.summary',
          params: { variantGroupId: VariantGroups.data.item.id }
        },
        {
          heading: 'Variant Group Talk',
          route: 'events.genes.summary.variantGroups.talk.log',
          params: { variantGroupId: VariantGroups.data.item.id }
        }
      ], this.tabData);

      angular.copy({
        view: {
          backgroundColor: 'pageBackground'
        },
        summary: {
          backgroundColor: 'pageBackground2'
        },
        myVariantGroupsInfo: {
          backgroundColor: 'pageBackground2'
        },
        variantMenu: {
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
  function VariantGroupsController(VariantGroups, VariantGroupsViewOptions) {
    VariantGroupsViewOptions.init();
    // these will be passed to the entity-view directive controller, to be required by child entity component so that they
    // can get references to the view model and view options
    this.VariantGroupsViewModel = VariantGroups;
    this.VariantGroupsViewOptions = VariantGroupsViewOptions;
  }

})();
