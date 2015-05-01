(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(GenesConfig)
    .controller('GenesController', GenesController);

  // @ngInject
  function GenesConfig($stateProvider) {
    $stateProvider
      .state('events.genes', {
        abstract: true,
        url: '/genes/:geneId',
        templateUrl: 'app/views/events/genes/GenesView.tpl.html',
        resolve: /* @ngInject */ {
          Genes: 'Genes',
          gene: function(Genes, $stateParams) {
            return Genes.get($stateParams.geneId);
          },
          myGeneInfo: function(Genes, gene) {
            return Genes.getMyGeneInfo(gene.id);
          },
          variants: function(Genes, gene) {
            return Genes.queryVariants(gene.id);
          },
          variantGroups: function(Genes, gene) {
            return Genes.queryVariantGroups(gene.id);
          }
        },
        controller: 'GenesController',
        controllerAs: 'vm',
        deepStateRedirect: [ 'geneId' ],
        onExit: /* @ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      })
      .state('events.genes.summary', {
        url: '/summary',
        template: '<gene-summary show-menu="true"></gene-summary>',
        deepStateRedirect: true,
        sticky: true,
        data: {
          titleExp: '"Gene " + gene.name + " Summary"',
          navMode: 'sub'
        }
      })
      .state('events.genes.edit', {
        url: '/edit',
        template: '<gene-edit></gene-edit>',
        data: {
          titleExp: '"Gene " + gene.name + " Edit"',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function GenesController($scope,
                           $state,
                           $stateParams,
                           // resolved services
                           Genes) {
    var geneModel = this.geneModel = {};

    geneModel.config = {
      type: 'gene',
      name: Genes.data.item.name,
      state: {
        baseState: 'events.genes',
        stateParams: $stateParams,
        baseUrl: $state.href('events.genes', $stateParams)
      },
      tabData: [
        {
          heading: 'Gene Summary',
          route: 'events.genes.summary',
          params: { geneId: gene.id }
        },
        {
          heading: 'Gene Talk',
          route: 'events.genes.talk.log',
          params: { geneId: gene.id }
        }
      ],
      styles: {
        view: {
          backgroundColor: 'pageBackground2'
        },
        summary: {
          backgroundColor: 'pageBackground2'
        },
        myGeneInfo: {
          backgroundColor: 'pageBackground2'
        },
        variantMenu: {
          backgroundColor: 'pageBackground2'
        },
        edit: {
          summaryBackgroundColor: 'pageBackground2'
        }
      }
    };

    geneModel.data = {
      entity: gene,
      id: gene.id,
      variants: variants,
      variantGroups: variantGroups,
      myGeneInfo: myGeneInfo
    };

    geneModel.services = {
      Genes: Genes,
      MyGeneInfo: MyGeneInfo
    };

    geneModel.actions = {
      get: function() {
        return gene;
      },

      update: function(reqObj) {
        reqObj.geneId = gene.id;
        Genes.update(reqObj);
        this.refresh();
      },

      refresh: function () {
        Genes.refresh(gene.id)
          .then(function(response) {
            geneModel.data.entity = response;
            return response;
          })
      },
      submitChange: function(reqObj) {
        reqObj.geneId = gene.id;
        return Genes.submitChange(reqObj)
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(changeId) {
        return Genes.acceptChange({ geneId: gene.id, changeId: changeId })
          .then(function(response) {

            return response;
          })
      }
    };
  }

})();
