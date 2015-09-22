(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(variantTalkConfig)
    .factory('VariantsTalkViewOptions', VariantsTalkViewOptions)
    .controller('VariantTalkController', VariantTalkController);

  // @ngInject
  function variantTalkConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.talk', {
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
      .state('events.genes.summary.variants.talk.log', {
        url: '/log',
        template: '<variant-talk-log></variant-talk-log>',
        data: {
          titleExp: '"Variant " + variant.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.comments', {
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
      this.state.baseState = 'events.genes.summary.variants.talk';
      this.state.baseUrl = $state.href(this.state.baseState, $stateParams);

      angular.copy([
        {
          heading: variant.name + ' Revisions',
          route: this.state.baseState + '.revisions.list',
          params: $stateParams
        },
        {
          heading: variant.name  + ' Comments',
          route: this.state.baseState + '.comments',
          params: $stateParams
        },
        {
          heading: variant.name + ' Log',
          route: this.state.baseState + '.log',
          params: $stateParams
        },

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
  function VariantTalkController(Variants, VariantRevisions, VariantsTalkViewOptions) {
    console.log('VariantsTalkController called.');
    VariantsTalkViewOptions.init();
    this.VariantsTalkViewModel = Variants; // we're re-using the Variants model here but could in the future have a VariantsTalk model if warranted
    this.VariantRevisionsModel = VariantRevisions;
    this.VariantsTalkViewOptions = VariantsTalkViewOptions;
  }

})();
