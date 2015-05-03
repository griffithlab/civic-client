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
          init: function(Genes, $stateParams) {
            return Genes.init($stateParams.geneId);
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

    this.geneModel = Genes;
    this.genesViewOptions =  {
      state: {
        baseState: 'events.genes',
        stateParams: $stateParams,
        baseUrl: $state.href('events.genes', $stateParams)
      },
      tabData: [
        {
          heading: 'Gene Summary',
          route: 'events.genes.summary',
          params: { geneId: Genes.data.item.id }
        },
        {
          heading: 'Gene Talk',
          route: 'events.genes.talk.log',
          params: { geneId: Genes.data.item.id }
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
  }

})();
