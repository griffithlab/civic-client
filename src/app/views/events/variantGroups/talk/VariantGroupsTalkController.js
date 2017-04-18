(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .config(variantTalkConfig)
    .factory('VariantGroupsTalkViewOptions', VariantGroupsTalkViewOptions)
    .controller('VariantGroupsTalkController', VariantGroupsTalkController);

  // @ngInject
  function variantTalkConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variantGroups.talk', {
        abstract: true,
        url: '/talk',
        templateUrl: 'app/views/events/variantGroups/talk/VariantGroupTalkView.tpl.html',
        controller: 'VariantGroupsTalkController',
        controllerAs: 'vm',
        resolve: {
          VariantGroupRevisions: 'VariantGroupRevisions',
          VariantGroupHistory: 'VariantGroupHistory',
          initVariantGroupTalk: function(VariantGroups, VariantGroupRevisions, VariantGroupHistory, $stateParams, $cacheFactory, $q) {
            var variantGroupId = $stateParams.variantGroupId;
            return $q.all([
              VariantGroups.initComments(variantGroupId),
              VariantGroupRevisions.initRevisions(variantGroupId),
              VariantGroupHistory.initBase(variantGroupId)
            ]);
          }
        },
        deepStateRedirect: [ 'variantGroupId' ],
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.talk.log', {
        url: '/log',
        template: '<variant-group-talk-log></variant-group-talk-log>',
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.talk.comments', {
        url: '/comments',
        template: '<variant-group-talk-comments></variant-group-talk-comments>',
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Comments"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantGroupsTalkViewOptions($state, $stateParams, VariantGroups) {
    var baseUrl = '';
    var baseState = '';
    var tabData = [];
    var styles = {};

    var variantGroup = VariantGroups.data.item;

    function init() {
      this.state.baseState = 'events.genes.summary.variantGroups.talk';
      this.state.baseUrl = $state.href(this.state.baseState, $stateParams);

      angular.copy([
        {
          heading: variantGroup.name + ' Revisions',
          route: this.state.baseState + '.revisions.list',
          params: $stateParams
        },
        {
          heading: variantGroup.name  + ' Comments',
          route: this.state.baseState + '.comments',
          params: $stateParams
        },
        {
          heading: variantGroup.name + ' Log',
          route: this.state.baseState + '.log',
          params: $stateParams
        }
      ], tabData);

      angular.copy({
        view: {
          summaryBackgroundColor: 'pageBackground',
          talkBackgroundColor: 'pageBackground'
        },
        tabs: {
          tabRowBackground: 'pageBackgroundGradient'
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
  function VariantGroupsTalkController($scope, VariantGroups, VariantGroupRevisions, VariantGroupsTalkViewOptions) {
    var self = this;
    console.log('VariantGroupsTalkController called.');
    VariantGroupsTalkViewOptions.init();
    this.VariantGroupsTalkViewModel = VariantGroups; // we're re-using the VariantGroups model here but could in the future have a VariantGroupsTalk model if warranted
    this.VariantGroupRevisionsModel = VariantGroupRevisions;
    this.VariantGroupsTalkViewOptions = VariantGroupsTalkViewOptions;

    $scope.$watch(
      function() { return self.VariantsTalkViewModel.data.item.name; },
      function(newName) {
        _.each(self.VariantsTalkViewOptions.tabData, function(tab) {
          var type = tab.heading.split(' ')[1];
          tab.heading = newName + ' ' + type;
        });
      }
    );
  }

})();
