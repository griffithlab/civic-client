(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantGrid', variantGrid)
    .controller('VariantGridController', VariantGridController);

  // @ngInject
  function variantGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        variants: '=',
        rows: '=',
        context: '=',
        variantGroup: '='
      },
      templateUrl: 'app/views/events/variantGroups/summary/variantGrid.tpl.html',
      controller: 'VariantGridController'
    };
    return directive;
  }

  // @ngInject
  function VariantGridController($scope,
                                 $window,
                                 $stateParams,
                                 $state,
                                 $filter,
                                 uiGridConstants,
                                 uiGridExporterConstants,
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
    ctrl.variantGridOptions = {
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
        { name: 'entrez_name',
          displayName: 'Gene',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          width: '9%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'name',
          displayName: 'Variant Name',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          width: '20%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'variant_group_list',
          displayName: 'Variant Group(s)',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          type: 'string',
          width: '20%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'variant_type_list',
          displayName: 'Variant Types(s)',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variantGroups/summary/variantGridTooltipCell.tpl.html'
        },
        {
          name: 'description',
          displayName: 'Description',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variantGroups/summary/variantGridDescriptionCell.tpl.html'
        }
      ]
    };

    ctrl.variantGridOptions.onRegisterApi = function(gridApi){
      var variants = $scope.variants;
      ctrl.gridApi = gridApi;

      ctrl.context = $scope.context;
      ctrl.variantGroup = $scope.variantGroup;
      ctrl.variantGridOptions.data = prepVariants(variants);

      ctrl.exportData = function() {
        ctrl.variantGridOptions.exporterCsvFilename = getFilename();
        var rows = ctrl.exportPopover.include === 'all' ? uiGridExporterConstants.ALL : uiGridExporterConstants.VISIBLE;
        if(ctrl.exportPopover.type === 'csv') {
          gridApi.exporter.csvExport(rows, uiGridExporterConstants.ALL);
        } else {
          gridApi.exporter.pdfExport(rows, uiGridExporterConstants.ALL);
        }
      };

      function getFilename(variant) {
        var dateTime = $filter('date')(new Date(), 'yyyy-MM-ddTHH:MM:ss');
        return 'CIViC_' + variant.name+ '_variants_' + dateTime + '.csv';
      }

      $scope.$watchCollection('variants', function(variants) {
        ctrl.variantGridOptions.minRowsToShow = variants.length + 1;
        ctrl.variantGridOptions.data = prepVariants(variants);
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event){
        var params = _.merge($stateParams, { variantId: row.entity.id, geneId: row.entity.gene_id });
        if(event.metaKey) {
          // if meta key (alt or command) pressed, generate a state URL and open it in a new tab/window
          // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
          // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
          var url = $state.href('events.genes.summary.variants.summary', params, {absolute: true});
          $window.open(url, '_blank');
        } else {
          $state.go('events.genes.summary.variants.summary', params);
        }
      });

      function prepVariants(variants) {
        return  _.map(variants, function(item){
          // create variant group list
          if (_.isArray(item.variant_groups) && item.variant_groups.length > 0) {
            item.variant_group_list = _.map(item.variant_groups, 'name').join(', ');
          } else {
            item.variant_group_list = 'N/A';
          }

          // create variant types list
          if (_.isArray(item.variant_types) && item.variant_types.length > 0) {
            item.variant_type_list = _.map(item.variant_types, 'display_name').join(', ');
          } else {
            item.variant_type_list = 'N/A';
          }
          return item;
        });
      }
    };
  }

})();
