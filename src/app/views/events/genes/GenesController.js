(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(GenesConfig)
    .factory('GenesViewOptions', GenesViewOptions)
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
  function GenesViewOptions($state, $stateParams, Genes) {
    var baseParams = {};
    var baseUrl = '';
    var baseState = '';
    var tabData = [];
    var styles = {};

    function init() {
      angular.copy($stateParams, baseParams);
      baseState = 'events.genes';
      baseUrl = $state.href(baseUrl, $stateParams);

      angular.copy([
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
      ], tabData);

      angular.copy({
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
      }, styles);
    }

    return {
      init: init,
      state: {
        baseParams: baseParams,
        baseState: baseState,
        baseUrl: baseUrl
      },
      tabData: tabData,
      styles: styles
    };
  }

  // @ngInject
  function GenesController(Genes, GenesViewOptions) {
    GenesViewOptions.init();
    // these will be passed to the entity-view directive controller, to be required by child entity component so that they
    // can get references to the view model and view options
    this.genesViewModel = Genes;
    this.genesViewOptions = GenesViewOptions;
  }

})();
