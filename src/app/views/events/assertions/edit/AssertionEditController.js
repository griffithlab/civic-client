(function() {
  'use strict';
  angular.module('civic.events.assertions')
    .config(assertionEditConfig)
    .factory('AssertionEditViewOptions', AssertionEditViewOptions)
    .controller('AssertionEditController', AssertionEditController);

  // @ngInject
  function assertionEditConfig($stateProvider) {
    $stateProvider
      .state('events.assertions.edit', {
        abstract: true,
        url: '/edit',
        templateUrl: 'app/views/events/assertions/edit/AssertionEditView.tpl.html',
        controllerAs: 'vm',
        resolve: {
          AssertionRevisions: 'AssertionRevisions',
          initAssertionEdit: function(Assertions, AssertionRevisions, AssertionHistory, $stateParams, $q) {
            var assertionId = $stateParams.assertionId;
            return $q.all([
              Assertions.get($stateParams.assertionId),
              Assertions.queryAcmgCodes(),
              AssertionRevisions.initRevisions(assertionId),
              AssertionRevisions.getPendingFields(assertionId),
              AssertionHistory.initBase(assertionId)
            ]);
          }
        },
        deepStateRedirect: [ 'assertionId' ],
        data: {
          titleExp: '"Assertion " + assertion.name + " Edit"',
          navMode: 'sub'
        }
      })
      .state('events.assertions.edit.basic', {
        url: '/basic',
        template: '<assertion-edit acmg-codes="acmgCodes"></assertion-edit>',
        data: {
          titleExp: '"Assertion " + assertion.name + " Edit"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function AssertionEditViewOptions($state, $stateParams) {
    var baseUrl = '';
    var baseState = '';
    var styles = {};

    function init() {
      baseState = 'events.assertions.edit';
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
  function AssertionEditController(Assertions, AssertionRevisions, AssertionEditViewOptions) {
    console.log('AssertionEditController called.');
    AssertionEditViewOptions.init();
    this.AssertionEditViewModel = Assertions; // we're re-using the Assertions model here but could in the future have a AssertionEdit model if warranted
    this.AssertionRevisionsModel = AssertionRevisions;
    this.AssertionEditViewOptions = AssertionEditViewOptions;
  }

})();
