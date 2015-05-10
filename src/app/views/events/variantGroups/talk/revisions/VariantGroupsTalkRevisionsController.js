(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .config(variantGroupTalkRevisionsConfig)
    .factory('VariantTalkRevisionsViewOptions', VariantTalkRevisionsViewOptions)
    .controller('VariantGroupTalkRevisionsController', VariantTalkRevisionsController);

  // @ngInject
  function variantGroupTalkRevisionsConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variantGroups.talk.revisions', {
        abstract: true,
        url: '/revisions',
        templateUrl: 'app/views/events/variantGroups/talk/revisions/VariantGroupTalkRevisionsView.tpl.html',
        controller: 'VariantGroupTalkRevisionsController',
        controllerAs: 'vm',
        resolve: {
          VariantRevisions: 'VariantRevisions',
          VariantHistory: 'VariantHistory',
          initVariantGroupTalkRevisions: function(VariantGroups, VariantGroupRevisions, VariantGroupHistory, $stateParams, $q) {
            var variantGroupId = $stateParams.variantGroupId;
            return $q.all([
              VariantGroups.initComments(variantGroupId),
              VariantGroupRevisions.initRevisions(variantGroupId),
              VariantGroupHistory.initBase(variantGroupId)
            ]);
          }
        },
        deepStateRedirect: [ 'variantGroupId', 'revisionId' ],
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.talk.revisions.list', {
        url: '/list/:revisionId',
        template: '<variant-group-talk-revisions></variant-group-talk-revisions>',
        resolve: {
          initRevisionList: function(Variants, VariantRevisions, VariantHistory, $stateParams) {
            return VariantRevisions.queryFresh($stateParams.variantGroupId);
          }
        },
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Revisions"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.talk.revisions.list.summary', {
        url: '/summary',
        template: '<variant-group-talk-revision-summary></variant-group-talk-revision-summary>',
        resolve: {
          initRevision: function(VariantRevisions, $stateParams, $q) {
            return $q.all([
              VariantRevisions.getFresh($stateParams.variantGroupId, $stateParams.revisionId),
              VariantRevisions.queryCommentsFresh($stateParams.variantGroupId, $stateParams.revisionId)
            ]);
          }
        },
        data: {
          titleExp: '"Variant Group " + variantGroup.name + " Revision Summary"',
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

    var variantGroup = VariantGroups.data.item;

    function init() {
      baseState = 'events.genes.summary.variantGroups.talk.revisions';
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
  function VariantTalkRevisionsController(VariantGroups, VariantGroupRevisions, VariantGroupTalkRevisionsViewOptions) {
    console.log('VariantTalkRevisionsRevisionsController called.');
    VariantTalkRevisionsRevisionsViewOptions.init();
    this.VariantGroupRevisionsModel = VariantGroupRevisions;
    this.VariantGroupTalkRevisionsViewOptions = VariantGroupTalkRevisionsViewOptions;
  }

})();
