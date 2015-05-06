(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(variantTalkConfig)
    .factory('VariantsTalkViewOptions', VariantsTalkViewOptions)
    .controller('VariantTalkController', VariantTalkController);

  // @ngInject
  function variantTalkConfig($stateProvider) {
    $stateProvider
      .state('events.variants.talk', {
        abstract: true,
        url: '/talk',
        templateUrl: 'app/views/events/variants/talk/VariantTalkView.tpl.html',
        controller: 'VariantTalkController',
        controllerAs: 'vm',
        resolve: {
          VariantRevisions: 'VariantRevisions',
          VariantHistory: 'VariantHistory',
          initVariantTalk: function(Variants, VariantRevisions, VariantHistory, $stateParams, $cacheFactory, $q) {
            var variantId = $stateParams.variantId;
            return $q.all([
              Variants.initComments(variantId),
              VariantRevisions.initRevisions(variantId),
              VariantHistory.initBase(variantId)
            ]);
          }
        },
        deepStateRedirect: [ 'variantId' ],
        data: {
          titleExp: '"Variant " + variant.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.variants.talk.log', {
        url: '/log',
        template: '<variant-talk-log></variant-talk-log>',
        data: {
          titleExp: '"Variant " + variant.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.variants.talk.comments', {
        url: '/comments',
        template: '<variant-talk-comments></variant-talk-comments>',
        data: {
          titleExp: '"Variant " + variant.name + " Comments"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantsTalkViewOptions($state, $stateParams, Variants) {
    var baseUrl = '';
    var baseState = '';
    var tabData = [];
    var styles = {};

    var variant = Variants.data.item;

    function init() {
      baseState = 'events.variants.talk';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy([
        {
          heading: variant.name + ' Log',
          route: baseState + '.log',
          params: { variantId: variant.id }
        },
        {
          heading: variant.name  + ' Comments',
          route: baseState + '.comments',
          params: { variantId: variant.id }
        },
        {
          heading: variant.name + ' Revisions',
          route: baseState + '.revisions.list',
          params: { variantId: variant.id }
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
  function VariantTalkController(Variants, VariantRevisions, VariantsTalkViewOptions) {
    console.log('VariantsTalkController called.');
    VariantsTalkViewOptions.init();
    this.VariantsTalkViewModel = Variants; // we're re-using the Variants model here but could in the future have a VariantsTalk model if warranted
    this.VariantRevisionsModel = VariantRevisions;
    this.VariantsTalkViewOptions = VariantsTalkViewOptions;
  }

})();
