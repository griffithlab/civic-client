(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(GenesConfig)
    .controller('GenesController', GenesController)
    .factory('genesViewOptions', genesViewOptions);

  // @ngInject
  function GenesConfig($stateProvider) {
    $stateProvider
      .state('events.genes', {
        abstract: true,
        url: '/genes/:geneId',
        templateUrl: 'app/views/events/genes/GenesView.tpl.html',
        resolve: /* @ngInject */ {
          Genes: 'Genes',
          initGeneModel: function(Genes, $stateParams) {
            return Genes.init($stateParams.geneId);
          },
          initGenesViewOptions: function(Genes, genesViewOptions, $state, $stateParams) {
            return genesViewOptions.init(Genes, $state, $stateParams);
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

  function genesViewOptions() {

    var state = {};

    function init(Genes, $state, $stateParams) {
      angular.copy({
        baseState: 'events.genes',
        stateParams: $stateParams,
        baseUrl: $state.href('events.genes', $stateParams)
      }, state);
    }

    return {
      init: init,
      state: state,
      tabData: [
        {
          heading: 'Gene Summary',
          route: 'events.genes.summary',
          params: $stateParams
        },
        {
          heading: 'Gene Talk',
          route: 'events.genes.talk.log',
          params: $stateParams
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

  // @ngInject
  function GenesController($scope,
                           $state,
                           $stateParams,
                           // resolved services
                           Genes) {

    this.geneModel = Genes;
    this.geneConfig =  {
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
