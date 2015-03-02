(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseCtrl', BrowseCtrl);

// @ngInject
  function BrowseCtrl($scope, uiGridConstants, Browse, $state, _, $log) {
    var ctrl = $scope.ctrl = {};

    var defaultBrowseMode = 'variant';

    ctrl.gridOptions = {
      enablePaginationControls: true,
      paginationPageSizes: [25],
      paginationPageSize: 25,
      minRowsToShow: 26,

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

    ctrl.byVariantColDefs = [
      {
        name: 'variant',
        enableFiltering: true,
        allowCellFocus: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      },
      {
        name: 'entrez_gene',
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
        enableFiltering: true,
        allowCellFocus: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        },
        cellTemplate: 'app/views/browse/browseGridDiseaseCell.tpl.html'
      },
      {
        name: 'evidence_item_count',
        displayName: 'Evidence Item Count',
        enableFiltering: true,
        allowCellFocus: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      }
    ];

    ctrl.byGeneColDefs  = [
      {
        name: 'entrez_gene',
        sort: {direction: uiGridConstants.ASC},
        enableFiltering: true,
        allowCellFocus: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      },
      {
        name: 'variant',
        enableFiltering: true,
        allowCellFocus: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      },
      {
        name: 'diseases',
        displayName: 'Diseases',
        enableFiltering: true,
        allowCellFocus: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        },
        cellTemplate: 'app/views/browse/browseGridDiseaseCell.tpl.html'
      },
      {
        name: 'evidence_item_count',
        displayName: 'Evidence Item Count',
        enableFiltering: true,
        allowCellFocus: false,
        filter: {
          condition: uiGridConstants.filter.CONTAINS
        }
      }
    ];

    var modeColumnDefs = {
      'variant': ctrl.byVariantColDefs,
      'gene': ctrl.byGeneColDefs
    }; // note: ui-grid watches columnDefs objs passed in as string, which we set up here and utilize in switchMode()

    ctrl.gridOptions.onRegisterApi = function(gridApi) {
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

    Browse.get({ count: 200 }).$promise
      .then(function(data) {
        ctrl.switchMode(defaultBrowseMode);
        ctrl.gridOptions.data = data.result;
      });

    ctrl.switchMode = function(mode) {
      ctrl.browseMode = mode;
      ctrl.gridOptions.columnDefs = modeColumnDefs[mode];
    };
  }
})();
