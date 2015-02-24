(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseCtrl', BrowseCtrl)
    .filter('ceil', ceilFilter);

// @ngInject
  function BrowseCtrl($scope, uiGridConstants, Browse, $state, _, $log) {
    $scope.events = {};

    /*jshint camelcase: false */
    $scope.browseGridOptions = {
      enablePaginationControls: true,
      paginationPageSizes: [10, 25, 50],
      paginationPageSize: 30,
      minRowsToShow: 25,

      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      rowTemplate: 'app/views/browse/browseGridRow.tpl.html',
      columnDefs: [
        { name: 'variant',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'entrez_gene',
          sort: { direction: uiGridConstants.ASC },
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'diseases',
          displayName: 'Diseases',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/browseGridDiseaseCell.tpl.html'
        },
        { name: 'evidence_item_count',
          displayName: 'Evidence Item Count',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ]

    };

    $scope.browseGridOptions.onRegisterApi = function(gridApi) {
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        $log.info(['geneID:', row.entity.entrez_id, 'variantId:', row.entity.variant_id].join(' '));
        $state.go('events.genes.summary.variants.summary', {
          geneId: row.entity.entrez_id,
          variantId: row.entity.variant_id
        });
      });
    };

    //$scope.gridInteractions = {
    //  rowClick: function (row) {
    //    $log.info(['geneID:', row.entity.entrez_id, 'variantId:', row.entity.variant_id].join(' '));
    //    $state.go('events.genes.summary.variants.summary', {
    //      geneId: row.entity.entrez_id,
    //      variantId: row.entity.variant_id
    //    });
    //  }
    //};

    Browse.get({ count: 200 }, function(data) {
      // categories & protein functions return arrays,
      $scope.browseGridOptions.data = data.result;
      $scope.events = data;
    });
  }

  function ceilFilter() {
    return function(num) {
      return Math.ceil(num);
    };
  }

})();
