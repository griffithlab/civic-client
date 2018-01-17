(function() {
  'use strict';
  angular.module('civic.assertions')
    .config(AssertionsConfig)
    .factory('AssertionsViewOptions', AssertionsViewOptions)
    .controller('AssertionsController', AssertionsController);

  // @ngInject
  function AssertionsConfig($stateProvider) {
    $stateProvider
      .state('events.assertions', {
        abstract: true,
        url: '/assertions/:assertionId',
        templateUrl: 'app/views/events/assertions/AssertionsView.tpl.html',
        controller: 'AssertionsController',
        controllerAs: 'vm',
        data: {
          titleExp: '"Assertions"',
          navMode: 'sub'
        }
      })
      .state('events.assertions.summary', {
        url: '/summary',
        templateUrl: 'app/views/events/assertions/summary/assertionsSummary.tpl.html',
        controller: 'AssertionsSummaryController',
        data: {
          titleExp: '"Assertion " + assertion.name',
          navMode: 'sub'
        },
        resolve: /* @ngInject */ {
          assertion: function(Assertions, $stateParams) {
            return Assertions.get($stateParams.assertionId);
          },
          myVariantInfo: function(assertion, Variants) {
            return Variants.getMyVariantInfo(assertion.variant.id);
          }
        }
      });
  }

  // @ngInject
  function AssertionsViewOptions($state, $stateParams) {
    var tabData = [];
    var state = {
      baseParams: {},
      baseState: '',
      baseUrl: ''
    };
    var styles = {};

    function init() {
      angular.copy($stateParams, this.state.baseParams);
      this.state.baseState = 'events.assertions';
      this.state.baseUrl = $state.href(this.state.baseState, $stateParams);

      angular.copy([
        {
          heading: 'Assertion Summary',
          route: 'events.assertions.summary',
          params: { assertionId: $stateParams.assertionId, '#': 'assertion' }
        },
        {
          heading: 'Assertion Talk',
          route: 'events.assertions.talk.revisions.list',
          params: { assertionId: $stateParams.assertionId, '#': 'assertion' }
        }
      ], this.tabData);

      angular.copy({
        view: {
          backgroundColor: 'pageBackground2'
        },
        summary: {
          backgroundColor: 'pageBackground2'
        },
        myAssertionInfo: {
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
  function AssertionsController(Assertions,
                                AssertionRevisions,
                                AssertionsViewOptions) {
    AssertionsViewOptions.init();
    // these will be passed to the entity-view directive controller, to be required by child entity component so that they
    // can get references to the view model and view options
    this.AssertionsViewModel = Assertions;
    this.AssertionsViewRevisions = AssertionRevisions;
    this.AssertionsViewOptions = AssertionsViewOptions;
  }
})();
