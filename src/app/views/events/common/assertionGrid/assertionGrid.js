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
          name: 'status',
          headerTooltip: 'Status',
          displayName: 'ST',
          type: 'string',
          visible: false
        },
        {
          name: 'id',
          displayName: 'AID',
          visible: true,
          type: 'number',
          enableSorting: true,
          enableFiltering: true,
          headerTooltip: 'Assertion ID',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/assertionGrid/assertionGridIdCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          minWidth: 75,
          width: '5%'
        },
        {
          name: 'gene.name',
          displayName: 'GENE',
          enableFiltering: true,
          allowCellFocus: false,
          headerTooltip: 'Gene Entrez Name',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/evidenceGridGeneCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '8%'
        },
        {
          name: 'variant.name',
          displayName: 'VARIANT',
          enableFiltering: true,
          allowCellFocus: false,
          headerTooltip: 'Variant Name',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/evidenceGridVariantCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '12%'
        },
        {
          name: 'disease.name',
          displayName: 'DIS',
          headerTooltip: 'Disease',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/evidenceGridDiseaseCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'druglist',
          displayName: 'DRUGS',
          headerTooltip: 'Drugs',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/evidenceGridDrugCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'summary',
          displayName: 'SUMM',
          width: '6%',
          headerTooltip: 'Summary',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/evidenceGridEvidenceCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_type',
          displayName: 'AT',
          headerTooltip: 'Assertion Type',
          enableFiltering: true,
          allowCellFocus: false,
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              {
                value: null,
                label: '--'
              },
              {
                value: 'Predictive',
                label: 'Predictive'
              },
              {
                value: 'Diagnostic',
                label: 'Diagnostic'
              },
              {
                value: 'Prognostic',
                label: 'Prognostic'
              },
              {
                value: 'Predisposing',
                label: 'Predisposing'
              },
              {
                value: 'Functional',
                label: 'Functional',
              },
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridTypeCell.tpl.html'
        },
        {
          name: 'evidence_direction',
          displayName: 'AD',
          headerTooltip: 'Assertion Direction',
          cellTemplate: 'app/views/events/common/evidenceDirectionCell.tpl.html',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Supports', label: 'Supports' },
              { value: 'Does Not Support', label: 'Does not Support' }
            ]
          },
          width: '6%',
          minWidth: 50
        },
        {
          name: 'clinical_significance',
          displayName: 'CS',
          headerTooltip: 'Clinical Significance',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Sensitivity/Response', label: 'Sensitivity/Response' },
              { value: 'Resistance', label: 'Resistance' },
              { value: 'Adverse Response', label: 'Adverse Response' },
              { value: 'Reduced Sensitivity', label: 'Reduced Sensitivity' },
              { value: 'Positive', label: 'Positive' },
              { value: 'Negative', label: 'Negative' },
              { value: 'Better Outcome', label: 'Better Outcome' },
              { value: 'Poor Outcome', label: 'Poor Outcome' },
              { value: 'Pathogenic', label: 'Pathogenic' },
              { value: 'Likely Pathogenic', label: 'Likely Pathogenic' },
              { value: 'Benign', label: 'Benign' },
              { value: 'Likely Benign', label: 'Likely Benign' },
              { value: 'Uncertain Significance', label: 'Uncertain Significance' },
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridClinicalSignificanceCell.tpl.html'
        },
        {
          name: 'evidence_item_count',
          width: '5%',
          displayName: 'EIDs',
          cellTemplate: 'app/views/events/common/assertionGrid/assertionGridEvidenceCell.tpl.html',
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
          // convert drug array to string
          if (_.isArray(assertion.drugs) && assertion.drugs.length > 0) {
            assertion.druglist = _.chain(assertion.drugs).map('name').value().join(', ');
          } else {
            assertion.druglist = 'N/A';
          }
          return assertion;
        });
      }
    };
  }

})();
