(function() {
  'use strict';
  angular.module('civic.events')
    .directive('changesGrid', changesGrid)
    .controller('ChangesGridController', ChangesGridController);

  // @ngInject
  function changesGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        changes: '=',
        rows: '=',
        context: '=',
      },
      templateUrl: 'app/views/events/common/changesGrid/changesGrid.tpl.html',
      controller: 'ChangesGridController'
    };
    return directive;
  }

  // @ngInject
  function ChangesGridController($scope,
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
    ctrl.changesGridOptions = {
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
        { name: 'created_at',
          displayName: 'Created',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
        },
        { name: 'status',
          displayName: 'Status',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
        },
      ]
    };

    ctrl.changesGridOptions.onRegisterApi = function(gridApi){
      var changes = $scope.changes;
      ctrl.gridApi = gridApi;

      ctrl.context = $scope.context;
      ctrl.variantGroup = $scope.variantGroup;
      ctrl.changesGridOptions.data = prepChangesData(changes);

      $scope.$watchCollection('changes', function(changes) {
        if(changes) {
          ctrl.changesGridOptions.minRowsToShow = changes.length + 1;
          ctrl.changesGridOptions.data = prepChangesData(changes);
        }
      });

      ctrl.exportData = function() {
        ctrl.changesGridOptions.exporterCsvFilename = getFilename($scope.variant);
        var rows = ctrl.exportPopover.include === 'all' ? uiGridExporterConstants.ALL : uiGridExporterConstants.VISIBLE;
        if(ctrl.exportPopover.type === 'csv') {
          gridApi.exporter.csvExport(rows, uiGridExporterConstants.ALL);
        } else {
          gridApi.exporter.pdfExport(rows, uiGridExporterConstants.ALL);
        }
      };

      function getFilename() {
        var dateTime = $filter('date')(new Date(), 'yyyy-MM-ddTHH:MM:ss');
        return 'CIViC_changes_' + dateTime + '.csv';
      }

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event){
        var params = _.merge($stateParams, {  changesId: row.entity.id });
        if(event.metaKey) {
          // if meta key (alt or command) pressed, changesrate a state URL and open it in a new tab/window
          // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
          // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
          var url = $state.href('events.changes.summary', params, {absolute: true});
          $window.open(url, '_blank');
        } else {
          $state.go('events.changes.summary', params);
        }
      });

      function prepChangesData(changes) {
        changes = _.map(changes, function(item){
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
        return changes;
      }
    };
  }

})();
