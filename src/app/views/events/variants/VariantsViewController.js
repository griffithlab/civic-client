(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(VariantsViewConfig)
    .controller('VariantsViewController', VariantsViewController);

  // @ngInject
  function VariantsViewConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variants', {
        abstract: true,
        url: '/variants/:variantId',
        templateUrl: 'app/views/events/variants/VariantsView.tpl.html',
        resolve: /* @ngInject */ {
          Variants: 'Variants',
          variant: function(Variants, $stateParams) {
            return Variants.get($stateParams.variantId);
          },
          evidenceItems: function(Variants, variant) {
            return Variants.getEvidenceItems(variant.id);
          }
        },
        controller: 'VariantsViewController'
      })
      .state('events.genes.summary.variants.summary', {
        url: '/summary',
        template: '<variant-summary></variant-summary>',
        data: {
          navMode: 'sub',
          titleExp: '"GENE SUMMARY TEST"'
        }
      });
    // additional events.variants states here
  }

  // @ngInject
  function VariantsViewController($scope,
                               $state,
                               Variants,
                               variant,
                                  gene) {

    var ctrl = $scope;
    var variantModel = ctrl.variantModel = {};

    variantModel.config = {
      type: 'variant',
      name: variant.name,
      state: {
        baseState: 'events.genes.summary.variants',
        baseUrl: $state.href('events.genes.summary.variants', { geneId: gene.entrez_id, variantId: variant.id })
      },
      styles: {
        tabs: {
          tabsBg: '#AAA',
          activeBg: 'pageBackground3',
          inactiveBg: '#CCC'
        },
        summary: {
          summaryBg: 'pageBackground3'
        },
        variantMenu: {
          variantMenuBg: 'pageBackground3',
          variantMenuActiveItemBg: 'pageBackground2'
        }
      }
    };

    variantModel.data = {
      entity: variant,
      id: variant.entrez_id,
      comments: [],
      changes: [],
      revisions: [],
      evidenceItems: []
    };

    variantModel.services = {
      Variants: Variants
    };

    variantModel.actions = {
      get: function() {
        return variant;
      },

      update: function(reqObj) {
        reqObj.variantId = variant.entrez_id;
        Variants.update(reqObj);
        this.refresh();
      },

      refresh: function () {
        Variants.refresh(variant.entrez_id)
          .then(function(response) {
            variant = response;
            return response;
          })
      },

      getComments: function() {
        return Variants.getComments(variant.entrez_id)
          .then(function(response) {
            variantModel.data.comments = response;
            return response;
          });
      },

      getComment: function(commentId) {
        return Variants.getComment(variant.entrez_id, commentId);
      },

      submitComment: function(reqObj) {
        reqObj.variantId = variant.entrez_id;
        return Variants.submitComment(reqObj)
          .then(function(response) {
            return response;
          });
      },

      updateComment: function(reqObj) {
        reqObj.variantId = variant.entrez_id;
        return Variants.updateComment(reqObj)
          .then(function(response){
            return response;
          });
      },

      deleteComment: function(commentId) {
        return Variants.deleteComment({ variantId: variant.entrez_id, commentId: commentId })
          .then(function(response) {
            return response;
          });
      },

      getChanges: function() {
        return Variants.getChanges(variant.entrez_id)
          .then(function(response) {
            variantModel.data.changes = response;
            return response;
          });
      },

      getChange: function(changeId) {
        return Variants.getChange({ variantId: variant.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      submitChange: function(reqObj) {
        reqObj.variantId = variant.entrez_id;
        return Variants.submitChange(reqObj)
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(changeId) {
        return Variants.acceptChange({ variantId: variant.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },
      rejectChange: function(changeId) {
        return Variants.rejectChange({ variantId: variant.entrez_id, changeId: changeId })
          .then(function(response) {
            return response;
          })
      },

      submitChangeComment: function(reqObj) {
        reqObj.variantId = variant.entrez_id;
        return Variants.submitChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        reqObj.variantId = variant.entrez_id;
        return Variants.updateChangeComment(reqObj)
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(changeId) {
        return Variants.getChangeComments({variantId: variant.entrez_id, changeId: changeId})
          .then(function(response) {
            return response;
          })
      },
      getChangeComment: function(changeId, commentId) {
        return Variants.getChangeComment({
          variantId: variant.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },
      deleteChangeComment: function(changeId, commentId) {
        return Variants.deleteChangeComment({
          variantId: variant.entrez_id,
          changeId: changeId,
          commentId: commentId
        }).then(function(response){
          return response;
        });
      },

      getRevisions: function() {
        return Variants.getRevisions(variant.entrez_id)
          .then(function(response) {
            variantModel.data.revisions = response;
            return response;
          });
      },
      getRevision: function(revisionId) {
        return Variants.getRevision({ variantId: variant.entrez_id, revisionId: revisionId })
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function() {
        return Variants.getLastRevision({ variantId: variant.entrez_id })
          .then(function(response) {
            return response;
          });
      }
    };
  }

})();
