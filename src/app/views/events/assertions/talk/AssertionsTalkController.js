(function() {
  'use strict';
  angular.module('civic.events.assertions')
    .config(assertionTalkConfig)
    .factory('AssertionsTalkViewOptions', AssertionsTalkViewOptions)
    .controller('AssertionTalkController', AssertionTalkController);

  // @ngInject
  function assertionTalkConfig($stateProvider) {
    $stateProvider
      .state('events.assertions.talk', {
        abstract: true,
        url: '/talk',
        templateUrl: 'app/views/events/assertions/talk/AssertionTalkView.tpl.html',
        controller: 'AssertionTalkController',
        controllerAs: 'vm',
        resolve: {
          AssertionRevisions: 'AssertionRevisions',
          AssertionHistory: 'AssertionHistory',
          initAssertionTalk: function(Assertions, AssertionRevisions, AssertionHistory, $stateParams, $cacheFactory, $q) {
            var assertionId = $stateParams.assertionId;
            return $q.all([
              Assertions.initComments(assertionId),
              AssertionRevisions.initRevisions(assertionId),
              AssertionHistory.initBase(assertionId)
            ]);
          }
        },
        deepStateRedirect: [ 'assertionId' ],
        data: {
          titleExp: '"Assertion " + assertion.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.assertions.talk.log', {
        url: '/log',
        template: '<assertion-talk-log></assertion-talk-log>',
        data: {
          titleExp: '"Assertion " + assertion.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.assertions.talk.comments', {
        url: '/comments',
        template: '<assertion-talk-comments></assertion-talk-comments>',
        data: {
          titleExp: '"Assertion " + assertion.name + " Comments"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function AssertionsTalkViewOptions($state, $stateParams, Assertions) {
    var baseUrl = '';
    var baseState = '';
    var tabData = [];
    var styles = {};

    var assertion = Assertions.data.item;

    function init() {
      baseState = 'events.assertions.talk';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy([
        {
          heading: assertion.name + ' Revisions',
          route: baseState + '.revisions.list',
          params: { assertionId: assertion.id }
        },
        {
          heading: assertion.name  + ' Comments',
          route: baseState + '.comments',
          params: { assertionId: assertion.id }
        },
        {
          heading: assertion.name + ' Log',
          route: baseState + '.log',
          params: { assertionId: assertion.id }
        }
      ], tabData);

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
      tabData: tabData,
      styles: styles
    };
  }

  // @ngInject
  function AssertionTalkController($scope, _, Assertions, AssertionRevisions, AssertionsTalkViewOptions) {
    var self = this;
    console.log('AssertionsTalkController called.');
    AssertionsTalkViewOptions.init();
    this.AssertionsTalkViewModel = Assertions; // we're re-using the Assertions model here but could in the future have a AssertionsTalk model if warranted
    this.AssertionRevisionsModel = AssertionRevisions;
    this.AssertionsTalkViewOptions = AssertionsTalkViewOptions;

    $scope.$watch(
      function() { return self.AssertionsTalkViewModel.data.item.name; },
      function(newName) {
        _.each(self.AssertionsTalkViewOptions.tabData, function(tab) {
          var type = tab.heading.split(' ')[1];
          tab.heading = newName + ' ' + type;
        });
      }
    );
  }

})();
