(function() {
  'use strict';

  angular.module('civic.common')
    .directive('assertionGrid', assertionGrid)
    .controller('AssertionGridController', AssertionGridController);

  // @ngInject
  function assertionGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        assertions: '=',
        rows: '=',
        context:'='
      },
      templateUrl: 'app/views/events/common/assertionGrid/assertionGrid.tpl.html',
      controller: 'AssertionGridController'
    };
    return directive;
  }

  // @ngInject
  function AssertionGridController($scope,
                                $state,
                                $window,
                                $filter,
                                uiGridExporterConstants,
                                uiGridConstants,
                                _) {
    console.log('AssertionGridController Loaded.');

    var ctrl = $scope.ctrl = {};

    ctrl.exportPopover = {
      templateUrl: 'app/views/events/common/gridExportPopover.tpl.html',
      title: 'Save CSV',
      include: 'all',
      type: 'csv'
    };

    ctrl.rowsToShow = $scope.rows ? $scope.rows : 10;
    ctrl.assertionGridOptions = {
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
        {
          name: 'id',
          displayName: 'AID',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          width: '8%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'summary',
          displayName: 'Summary',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '20%',
          cellTemplate: 'app/views/sources/components/cellTemplateTooltip.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'description',
          displayName: 'Description',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '30%',
          cellTemplate: 'app/views/sources/components/cellTemplateTooltip.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item_count',
          width: '10%',
          displayName: 'Evidence',
          sort: {
            direction: uiGridConstants.DESC
          },
          enableFiltering: false,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ]
    };

    ctrl.assertionGridOptions.onRegisterApi = function (gridApi) {
      var assertions = $scope.assertions;
      ctrl.gridApi = gridApi;

      ctrl.context = $scope.context;
      ctrl.assertionGridOptions.data = prepAssertions(assertions);

      $scope.$watchCollection('assertions', function (assertions) {
        ctrl.assertionGridOptions.minRowsToShow = assertions.length + 1;
        ctrl.assertionGridOptions.data = prepAssertions(assertions);
      });

      ctrl.exportData = function() {
        ctrl.assertionGridOptions.exporterCsvFilename = getFilename($scope.variant);
        var rows = ctrl.exportPopover.include === 'all' ? uiGridExporterConstants.ALL : uiGridExporterConstants.VISIBLE;
        if(ctrl.exportPopover.type === 'csv') {
          gridApi.exporter.csvExport(rows, uiGridExporterConstants.ALL);
        } else {
          gridApi.exporter.pdfExport(rows, uiGridExporterConstants.ALL);
        }
      };

      function getFilename() {
        var dateTime = $filter('date')(new Date(), 'yyyy-MM-ddTHH:MM:ss');
        return 'CIViC_assertions_' + dateTime + '.csv';
      }

      gridApi.selection.on.rowSelectionChanged($scope, function (row, event) {
        var params = {assertionId: row.entity.id};
        if (event.metaKey) {
          // if meta key (alt or command) pressed, generate a state URL and open it in a new tab/window
          // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
          // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
          var url = $state.href('events.assertions.summary', params, {absolute: true});
          $window.open(url, '_blank');
        } else {
          $state.go('events.assertions.summary', params);
        }
      });

      function prepAssertions(assertions) {
        return _.map(assertions, function(assertion) {
          return assertion;
        });
      }
    };
  }

})();
