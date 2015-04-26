(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .config(VariantGroupsConfig)
    .controller('VariantGroupsController', VariantGroupsController);

  // @ngInject
  function VariantGroupsConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.variantGroups', {
        abstract: true,
        url: '/variant_groups/:variantGroupId',
        templateUrl: 'app/views/events/variantGroups/VariantGroupsView.tpl.html',
        resolve: /* @ngInject */ {
          VariantGroups: 'VariantGroups',
          variantGroup: function(VariantGroups, $stateParams) {
            return VariantGroups.get($stateParams.variantGroupId);
          }
        },
        controller: 'VariantGroupsController',
        deepStateRedirect: { params: ['variantGroupId'] }
      })
      .state('events.genes.summary.variantGroups.summary', {
        url: '/summary',
        template: '<variant-group-summary></variant-group-summary>',
        data: {
          titleExp: '"Variant Group " + variantGroup.name',
          navMode: 'sub'
        }
      })
      .state('events.genes.summary.variantGroups.edit', {
        url: '/edit',
        template: '<variant-group-edit></variant-group-edit>',
        data: {
          titleExp: '"Variant Group " + variantGroup.name',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function VariantGroupsController($scope,
                                  $state,
                                  // resolved assets
                                  VariantGroups,
                                  variantGroup,
                                  // inherited resolved assets
                                  gene) {
    var ctrl,
      variantGroupModel,
      baseState,
      baseUrl;

    ctrl = $scope.ctrl;
    variantGroupModel = ctrl.variantGroupModel = {};
    baseState = 'events.genes.summary.variantGroups';
    baseUrl = $state.href('events.genes.summary.variantGroups', {
      geneId: gene.entrez_id,
      variantGroupId: variantGroup.id
    });

    variantGroupModel.config = {
      type: 'variant group',
      name: variantGroup.name,
      state: {
        baseState: baseState,
        baseUrl: baseUrl
      },
      styles: {
        tabs: {
          tabsBg: '#AAA',
          activeBg: 'pageBackground3',
          inactiveBg: '#CCC'
        },
        summary: {
          summaryBg: 'pageBackground3'
        }
      }
    };

    variantGroupModel.data = {
      // required entity data fields
      entity: variantGroup,
      id: variantGroup.id,
      comments: [],
      changes: [],
      revisions: [],

      // additional entity data
      variants: variantGroup.variants
    };

    variantGroupModel.services = {
      VariantGroups: VariantGroups
    };

    variantGroupModel.actions = {
      get: function() {
        return variantGroup;
      },

      update: function(reqObj) {
        reqObj.variantGroupId = variantGroup.id;
        VariantGroups.update(reqObj);
        this.refresh();
      },

      refresh: function () {
        VariantGroups.refresh(variantGroup.id)
          .then(function(response) {
            variantGroup = response;
            return response;
          })
      }
    };
  }

})();
