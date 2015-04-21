(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(variantTalkViewConfig)
    .controller('VariantTalkViewController', VariantTalkViewController);

  // @ngInject
  function variantTalkViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants.talk', {
        url: '/talk',
        templateUrl: 'app/views/events/variants/talk/VariantTalkView.tpl.html',
        controller: 'VariantTalkViewController',
        resolve: {
          comments: function(Variants, variant) {
            return Variants.getComments(variant.id);
          },
          changes: function(Variants, variant) {
            return Variants.getChanges(variant.id);
          },
          revisions: function(Variants, variant) {
            return Variants.getRevisions(variant.id);
          },
          lastRevision: function(Variants, variant) {
            return Variants.getLastRevision(variant.id);
          }
        },
        data: {
          titleExp: '"Variant " + variant.name + " Talk"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.log', {
        url: '/log', // transition to events.genes.talk abstract state defaults to this state
        template: '<entity-talk-log entity-talk-model="ctrl.variantTalkModel"></entity-talk-log>',
        data: {
          titleExp: '"Variant " + variant.name + " Log"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.comments', {
        url: '/comments',
        template: '<entity-talk-comments entity-talk-model="ctrl.variantTalkModel"></entity-talk-comments>',
        data: {
          titleExp: '"Variant " + variant.name + " Comments"',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variants.talk.revisions', {
        url: '/revisions',
        template: '<entity-talk-revisions entity-talk-model="ctrl.variantTalkModel"></entity-talk-revisions>',
        data: {
          titleExp: '"Variant " + variant.name + " Revisions"',
          navMode: 'sub'
        }
      })
  }

  // @ngInject
  function VariantTalkViewController($scope,
                                     $state,

                                     // resolved resources
                                     comments,
                                     changes,
                                     revisions,
                                     lastRevision,

                                     // inherited resolved resources
                                     gene,
                                     variant,
                                     evidenceItems) {
    console.log('VariantsTalkController called.');
    var ctrl = $scope.ctrl = {};
    var variantTalkModel = ctrl.variantTalkModel = {};

    variantTalkModel.config = {
      type: 'variant',
      name: variant.name,
      state: {
        baseState: 'events.genes.summary.variants.talk',
        baseUrl: $state.href('events.genes.summary.variants.talk', { geneId: gene.entrez_id, variantId: variant.id })
      },
      styles: {
        view: {
          summaryBackgroundColor: 'pageBackground',
          talkBackgroundColor: 'pageBackground2'
        }
      },
      tabData: [
        {
          heading: variant.name + ' Log',
          route: 'events.genes.summary.variants.talk.log',
          params: { geneId: gene.entrez_id, variantId: variant.id }
        },
        {
          heading: variant.name + ' Comments',
          route: 'events.genes.summary.variants.talk.comments',
          params: { geneId: gene.entrez_id, variantId: variant.id }
        },
        {
          heading: variant.name + ' Revisions',
          route: 'events.genes.summary.variants.talk.revisions',
          params: { geneId: gene.entrez_id, variantId: variant.id }
        }
      ]
    };

    variantTalkModel.data = {
      entity: variant,
      id: variant.id,
      parent: gene,
      parentId: gene.entrez_id,
      evidenceItems: evidenceItems,
      comments: comments,
      changes: changes,
      revisions: revisions,
      lastRevision: lastRevision
    };
  }

})();
