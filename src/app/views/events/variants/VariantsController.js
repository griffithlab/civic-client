(function() {
  'use strict';
  angular.module('civic.events.variants')
    .config(VariantsConfig)
    .controller('VariantsController', VariantsController);

  // @ngInject
  function VariantsConfig($stateProvider) {
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
        controller: 'VariantsController',
        deepStateRedirect: { params: ['variantId'] }
      })
      .state('events.genes.summary.variants.summary', {
        url: '/summary',
        template: '<variant-summary></variant-summary>',
        deepStateRedirect: { params: ['variantId'] },
        data: {
          navMode: 'sub',
          titleExp: '"Variant " + variant.name'
        }
      })
      .state('events.variants.edit', {
        url: '/edit',
        template: '<variant-edit></variant-edit>',
        data: {
          titleExp: '"Variant " + gene.entrez_name + " Edit"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantsController($scope,
                                  $state,
                                  // resolved services
                                  Variants,
                                  variant,
                                  evidenceItems,
                                  // inherited resources
                                  gene) {

    var ctrl = $scope.ctrl;
    var variantModel = ctrl.variantModel = {};

    variantModel.config = {
      type: 'variant',
      name: variant.name,
      state: {
        baseState: 'events.genes.summary.variants',
        baseUrl: $state.href('events.genes.summary.variants', { geneId: gene.entrez_id, variantId: variant.id })
      },
      tabData: [
        {
          heading: 'Variant Summary',
          route: 'events.genes.summary.variants.summary',
          params: { geneId: gene.entrez_id, variantId: variant.id }
        },
        {
          heading: 'Variant Talk',
          route: 'events.genes.summary.variants.talk.log',
          params: { geneId: gene.entrez_id, variantId: variant.id }
        }
      ],
      styles: {
        view: {
          backgroundColor: 'pageBackground',
          foregroundColor: 'pageBackground2'
        }
      }
    };

    variantModel.data = {
      // required entity data fields
      entity: variant,
      id: variant.id,
      comments: [],
      changes: [],
      revisions: [],
      // additional entity data fields
      evidenceItems: evidenceItems
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
      }
    };
  }

})();
