(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneGrid', geneGrid)
    .controller('GeneGridController', GeneGridController);

  // @ngInject
  function geneGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        genes: '=',
        rows: '=',
        context: '=',
        variantGroup: '='
      },
      templateUrl: 'app/views/events/common/geneGrid/geneGrid.tpl.html',
      controller: 'GeneGridController'
    };
    return directive;
  }

  // @ngInject
  function GeneGridController($scope,
                              $window,
                              $stateParams,
                              $state,
                              $filter,
                              uiGridExporterConstants,
                              uiGridConstants,
                              _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

    ctrl.exportPopover = {
      templateUrl: 'app/views/events/common/gridExportPopover.tpl.html',
      title: 'Save CSV',
      include: 'all',
      type: 'csv'
    };

    ctrl.rowsToShow = $scope.rows === undefined ? 5 : $scope.rows;
    ctrl.geneGridOptions = {
      minRowsToShow: ctrl.rowsToShow - 1,
      //enablePaginationControls: true,
      //paginationPageSizes: [8],
      //paginationPageSize: 8,
      enablePaging: false,

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
      columnDefs: [
        //{ name: 'id',
        //  displayName: 'ID',
        //  enableFiltering: false,
        //  allowCellFocus: false,
        //  width: '5%'
        //},
        { name: 'name',
          displayName: 'Entrez Name',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/browse/directives/browseGridVariantCell.tpl.html',
          width: '10%'
        },
        { name: 'variant_list',
          displayName: 'Variants',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '40%',
          cellTemplate: 'app/views/events/common/geneGrid/tooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'variant_count',
          displayName: 'Count',
          enableFiltering: false,
          allowCellFocus: false,
          type: 'number',
          width: '8%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'description',
          displayName: 'Description',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          cellTemplate: 'app/views/events/common/geneGrid/tooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ]
    };

    ctrl.geneGridOptions.onRegisterApi = function(gridApi){
      var genes = $scope.genes;
      ctrl.gridApi = gridApi;

      ctrl.context = $scope.context;
      ctrl.variantGroup = $scope.variantGroup;
      ctrl.geneGridOptions.data = prepGeneData(genes);

      $scope.$watchCollection('genes', function(genes) {
        ctrl.geneGridOptions.minRowsToShow = genes.length + 1;
        ctrl.geneGridOptions.data = prepGeneData(genes);
      });

      ctrl.exportData = function() {
        ctrl.geneGridOptions.exporterCsvFilename = getFilename($scope.variant);
        var rows = ctrl.exportPopover.include === 'all' ? uiGridExporterConstants.ALL : uiGridExporterConstants.VISIBLE;
        if(ctrl.exportPopover.type === 'csv') {
          gridApi.exporter.csvExport(rows, uiGridExporterConstants.ALL);
        } else {
          gridApi.exporter.pdfExport(rows, uiGridExporterConstants.ALL);
        }
      };

      function getFilename() {
        var dateTime = $filter('date')(new Date(), 'yyyy-MM-ddTHH:MM:ss');
        return 'CIViC_genes_' + dateTime + '.csv';
      }

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event){
        var params = _.merge($stateParams, {  geneId: row.entity.id });
        if(event.metaKey) {
          // if meta key (alt or command) pressed, generate a state URL and open it in a new tab/window
          // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
          // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
          var url = $state.href('events.genes.summary', params, {absolute: true});
          $window.open(url, '_blank');
        } else {
          $state.go('events.genes.summary', params);
        }
      });

      function prepGeneData(genes) {
        genes = _.map(genes, function(item){
          if (_.isArray(item.variants) && item.variants.length > 0) {
            item.variant_list = _.map(item.variants, 'name').sort().join(', ');
            item.variant_count = item.variants.length;
          } else {
            item.variant_list = 'No variants found.';
            item.variant_count = 0;
          }

          if(Number(item.description.length) === 0) {
            item.description = 'No description found.';
          }

          return item;
        });
        return genes;
      }
    };
  }

})();
