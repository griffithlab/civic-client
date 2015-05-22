(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(variantTalkRevisionsConfig)
    .factory('VariantTalkRevisionsViewOptions', VariantTalkRevisionsViewOptions)
    .controller('VariantTalkRevisionsController', VariantTalkRevisionsController);

  // @ngInject
  function variantTalkRevisionsConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.talk.revisions', {
        abstract: true,
        url: '/revisions',
        templateUrl: 'app/views/events/variants/talk/revisions/VariantTalkRevisionsView.tpl.html',
        controller: 'VariantTalkRevisionsController',
        controllerAs: 'vm',
        resolve: {
          VariantRevisions: 'VariantRevisions',
          VariantHistory: 'VariantHistory',
          initVariantTalkRevisions: function(Variants, VariantRevisions, VariantHistory, $stateParams, $q) {
            var variantId = $stateParams.variantId;
            return $q.all([
              VariantRevisions.initRevisions(variantId),
              VariantHistory.initBase(variantId)
            ]);
          }
        },
        deepStateRedirect: [ 'variantId', 'revisionId' ],
        data: {
          titleExp: '"Variant " + variant.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.revisions.list', {
        url: '/list/:revisionId',
        template: '<variant-talk-revisions></variant-talk-revisions>',
        resolve: {
          initRevisionList: function(Variants, VariantRevisions, VariantHistory, $stateParams) {
            return VariantRevisions.queryFresh($stateParams.variantId);
          }
        },
        data: {
          titleExp: '"Variant " + variant.name + " Revisions"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.revisions.list.summary', {
        url: '/summary',
        template: '<variant-talk-revision-summary></variant-talk-revision-summary>',
        resolve: {
          initRevision: function(VariantRevisions, $stateParams, $q) {
            return $q.all([
              VariantRevisions.getFresh($stateParams.variantId, $stateParams.revisionId),
              VariantRevisions.queryCommentsFresh($stateParams.variantId, $stateParams.revisionId)
            ]);
          }
        },
        data: {
          titleExp: '"Variant " + variant.name + " Revision Summary"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantTalkRevisionsViewOptions($state, $stateParams, Variants) {
    var baseUrl = '';
    var baseState = '';
    var tabData = [];
    var styles = {};

    var variant = Variants.data.item;

    function init() {
      baseState = 'events.genes.summary.variants.talk.revisions';
      baseUrl = $state.href(baseState, $stateParams);

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
  function VariantTalkRevisionsController(Variants, VariantRevisions, VariantTalkRevisionsRevisionsViewOptions) {
    console.log('VariantTalkRevisionsRevisionsController called.');
    VariantTalkRevisionsRevisionsViewOptions.init();
    this.VariantRevisionsModel = VariantRevisions;
    this.VariantTalkRevisionsViewOptions = VariantTalkRevisionsViewOptions;
  }

})();
