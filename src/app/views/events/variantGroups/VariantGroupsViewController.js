(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .config(VariantGroupsViewConfig)
    .controller('VariantGroupsViewController', VariantGroupsViewController);

  // @ngInject
  function VariantGroupsViewConfig($stateProvider) {
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
        controller: 'VariantGroupsViewController',
        deepStateRedirect: { params: ['variantGroupId'] }
      })
      .state('events.genes.summary.variantGroups.summary', {
        url: '/summary',
        template: '<variant-group-summary></variant-group-summary>',
        data: {
          navMode: 'sub',
          titleExp: '"GENE SUMMARY TEST"'
        }
      });
  }

  // @ngInject
  function VariantGroupsViewController($scope,
                                  $state,
                                  // resolved assets
                                  VariantGroups,
                                  variantGroup,
                                  // inherited resolved assets
                                  gene) {
    console.log('-=-=-=-=-=-=- VariantGroupsViewController instantiated. -=-=-=-=-=-=-=-=-=-');
    var ctrl,
      variantGroupModel,
      baseState,
      baseUrl;

    ctrl = $scope;
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

      // parent ids
      geneId: gene.entrez_id,

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
