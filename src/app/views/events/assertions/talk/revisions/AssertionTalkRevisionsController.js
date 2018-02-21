(function() {
  'use strict';
  angular.module('civic.events.assertions')
    .config(assertionTalkRevisionsConfig)
    .factory('AssertionTalkRevisionsViewOptions', AssertionTalkRevisionsViewOptions)
    .controller('AssertionTalkRevisionsController', AssertionTalkRevisionsController);

  // @ngInject
  function assertionTalkRevisionsConfig($stateProvider) {
    $stateProvider
      .state('events.assertions.talk.revisions', {
        abstract: true,
        url: '/revisions',
        templateUrl: 'app/views/events/assertions/talk/revisions/AssertionTalkRevisionsView.tpl.html',
        controller: 'AssertionTalkRevisionsController',
        controllerAs: 'vm',
        resolve: {
          AssertionRevisions: 'AssertionRevisions',
          AssertionHistory: 'AssertionHistory',
          initAssertionTalkRevisions: function(Assertions, AssertionRevisions, AssertionHistory, $stateParams, $q) {
            var assertionId = $stateParams.assertionId;
            return $q.all([
              AssertionRevisions.initRevisions(assertionId),
              AssertionHistory.initBase(assertionId)
            ]);
          }
        },
        deepStateRedirect: [ 'assertionId', 'revisionId' ],
        data: {
          titleExp: '"Assertion " + assertion.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.assertions.talk.revisions.list', {
        url: '/list/:revisionId',
        template: '<assertion-talk-revisions></assertion-talk-revisions>',
        resolve: {
          initRevisionList: function(AssertionRevisions, $stateParams) {
            return AssertionRevisions.query($stateParams.assertionId);
          }
        },
        data: {
          titleExp: '"Assertion " + assertion.name + " Revisions"',
          navMode: 'sub'
        }
      })
      .state('events.assertions.talk.revisions.list.summary', {
        url: '/summary',
        template: '<assertion-talk-revision-summary></assertion-talk-revision-summary>',
        resolve: {
          initRevision: function(AssertionRevisions, $stateParams, $q) {
            return $q.all([
              AssertionRevisions.get($stateParams.assertionId, $stateParams.revisionId),
              AssertionRevisions.queryComments($stateParams.assertionId, $stateParams.revisionId)
            ]);
          }
        },
        data: {
          titleExp: '"Assertion " + assertion.name + " Revision Summary"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function AssertionTalkRevisionsViewOptions($state, $stateParams) {
    var baseUrl = '';
    var baseState = '';
    var styles = {};

    function init() {
      baseState = 'events.assertions.talk.revisions';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy({
        view: {
          summaryBackgroundColor: 'pageBackground',
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
  function AssertionTalkRevisionsController(Assertions, AssertionRevisions, AssertionTalkRevisionsRevisionsViewOptions) {
    console.log('AssertionTalkRevisionsRevisionsController called.');
    AssertionTalkRevisionsRevisionsViewOptions.init();
    this.AssertionRevisionsModel = AssertionRevisions;
    this.AssertionTalkRevisionsViewOptions = AssertionTalkRevisionsViewOptions;
  }

})();
