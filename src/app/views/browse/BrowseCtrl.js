(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseCtrl', BrowseCtrl)
    .filter('ceil', ceilFilter);

// @ngInject
  function BrowseCtrl($scope, $rootScope, uiGridConstants, Browse, $location, _, $log) {
    $log.info('BrowseCtrl loaded');
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Browse Events');

    $scope.events = {};

    $scope.browseGridOptions = {
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      rowTemplate: "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" ng-click=\"getExternalScopes().rowClick()\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
      columnDefs: [
        { name: 'entrez_gene',
          enableFiltering: true,
          sort: { direction: uiGridConstants.ASC }
        },
        { name: 'entrez_id',
          displayName: 'Entrez ID',
          enableFiltering: true
        },
        { name: 'variant',
          enableFiltering: true
        }
      ],
      minRowsToShow: 20
    };

    $scope.gridInteractions = {
      rowClick: function () {
        $log.info('row clicked.');
      }
    };

    Browse.get({ count: 100 }, function(data) {
      // categories & protein functions return arrays,
      $scope.browseGridOptions.data = data.result;

    });

//    $scope.tableParams = new ngTableParams({
//      page: 1,            // show first page
//      count: 25,          // count per page
//      sorting: {
//        entrez_gene: 'asc'     // initial sorting
//      }
//    }, {
//      total: 0,           // length of data
//      debugMode: true,
//      getData: function($defer, params) {
//        // ajax request to api
//        Browse.get(params.url(), function(data) {
//          // update table params
//          params.total(data.total);
//
//          // format categories & protein function
//          _.each(data.result, function(event) {
//            event.gene_category = event.gene_category.join();
//            event.protein_function = event.protein_function.join();
//          });
//
//          // set new data
//          $defer.resolve(data.result);
//        });
//      }
//    });
//
//    $scope.rowClick = function(gene) {
//      $state.go('events.genes.summary.variants.summary', { geneId: gene.entrez_gene, variantId: gene.variant });
////      $log.info('Clicked gene ' + ['/gene/', gene.entrez_gene, '/variant/', gene.variant].join(""));
////      var loc = ['/events/genes/', gene.entrez_gene, '/variants/', gene.variant].join("");
////      $log.info('location.path(' + loc + ')');
////      $location.path(loc);
//    };
  }


  function ceilFilter() {
    return function(num) {
      return Math.ceil(num);
    }
  }

})();
