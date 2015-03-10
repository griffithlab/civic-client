(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseCtrl', BrowseCtrl);

// @ngInject
  function BrowseCtrl($scope, $stateParams, uiGridConstants, Browse, $state, _, $log) {

    var ctrl = $scope.ctrl = {};
    var maxRows = ctrl.maxRows = 20;

    var defaultBrowseMode = 'variant';

    ctrl.gridOptions = {
      enablePaginationControls: false,
      paginationPageSizes: [maxRows],
      paginationPageSize: maxRows,
      minRowsToShow: maxRows + 1,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,

      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      rowTemplate: 'app/views/browse/browseGridRow.tpl.html'
    };

    // set up column defs and data transforms for each mode
    var modeColumnDefs = {
      'variant': [
        {
          name: 'variant',
          width: '30%',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'entrez_gene',
          width: '15%',
          sort: {direction: uiGridConstants.ASC},
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'diseases',
          displayName: 'Diseases',
          width: '45%',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/browseGridTooltipCell.tpl.html'
        },
        {
          name: 'evidence_item_count',
          width: '10%',
          displayName: 'Evidence',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ],
      'gene': [
        {
          name: 'entrez_gene',
          width: '15%',
          sort: {direction: uiGridConstants.ASC},
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'aliases',
          width: '30%',
          displayName: 'Gene Aliases',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/browse/browseGridTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'diseases',
          width: '30%',
          displayName: 'Diseases',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/browseGridTooltipCell.tpl.html'
        },
        {
          name: 'variant_count',
          displayName: 'Variants',
          width: '10%',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item_count',
          width: '10%',
          displayName: 'Evidence',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ]
    };
    var modeDataTransforms = {
      'variant': function(data) {
        // variant grid works with the raw data
        return data;
      },
      'gene': _.memoize(function(data) {
        // gene grid requires some munging
        return _.map(_.groupBy(data, 'entrez_gene'), function(variants, gene) {
          return {
            entrez_id: variants[0].entrez_id,
            aliases: variants[0].aliases.join(', '),
            entrez_gene: gene,
            variant_count: variants.length,
            diseases: _.chain(variants) // combine diseases from all variants
              .pluck('diseases')
              .tap(function(array) {
                return array.toString()
              })
              .words(/[^,]+/g)
              .map(function(disease) { return _.trim(disease)})
              .uniq()
              .value()
              .join(', '),
            evidence_item_count: _.reduce(variants, function(total, current) {
              return total + current.evidence_item_count;
            }, 0)
          }
        });
      })
    };


    ctrl.gridOptions.onRegisterApi = function(gridApi) {

      ctrl.currentPage = $stateParams.currentPage || 1;
      ctrl.previousPage = gridApi.pagination.previousPage;
      ctrl.nextPage = gridApi.pagination.nextPage;
      ctrl.seek = gridApi.pagination.seek;
      ctrl.getPage = gridApi.pagination.getPage;

      ctrl.getTotalPages = gridApi.pagination.getTotalPages;
      ctrl.pageChanged = function() {
        $log.info("page changed, current page: " + ctrl.currentPage);
        ctrl.seek(ctrl.currentPage);
      };


      ctrl.gridApi = gridApi;

      ctrl.paginationConfig = {

      };

      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        $log.info(['geneID:', row.entity.entrez_id, 'variantId:', row.entity.variant_id].join(' '));
        if(ctrl.browseMode == 'variant') {
          $state.go('events.genes.summary.variants.summary', {
            geneId: row.entity.entrez_id,
            variantId: row.entity.variant_id
          });
        } else {
          $state.go('events.genes.summary', {
            geneId: row.entity.entrez_id
          });
        }
      });
    };

    //ctrl.gridOptions.onRegisterApi = function(gridApi) {
    //  gridApi.selection.on.rowSelectionChanged($scope, function(row){
    //    $log.info(['geneID:', row.entity.entrez_id, 'variantId:', row.entity.variant_id].join(' '));
    //    if(ctrl.browseMode == 'variant') {
    //      $state.go('events.genes.summary.variants.summary', {
    //        geneId: row.entity.entrez_id,
    //        variantId: row.entity.variant_id
    //      });
    //    } else {
    //      $state.go('events.genes.summary', {
    //        geneId: row.entity.entrez_id
    //      });
    //    }
    //  });
    //};

    ctrl.rawData = [];
    Browse.get({ count: 200 }).$promise
      .then(function(data) {
        ctrl.rawData = data.result;
        ctrl.switchMode(defaultBrowseMode);
      });

    ctrl.switchMode = function(mode) {
      ctrl.browseMode = mode;
      ctrl.gridOptions.columnDefs = modeColumnDefs[mode];
      ctrl.gridOptions.data = modeDataTransforms[mode](ctrl.rawData);
      ctrl.currentPage = 1;
    };
  }
})();
