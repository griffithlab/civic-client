(function() {
  'use strict';
  angular.module('civic.events.assertions')
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
        resolve: /* @ngInject */ {
          Assertions: 'Assertions',
          initAssertion: function(Assertions, $stateParams) {
            return Assertions.initBase($stateParams.assertionId);
          },
          myVariantInfo: function(initAssertion, Assertions) {
            return Assertions.getMyVariantInfo(initAssertion[0].variant.id);
          }
        },
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
          backgroundColor: 'pageBackground'
        },
        summary: {
          backgroundColor: 'pageBackground'
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
