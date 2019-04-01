(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceGrid', evidenceGrid)
    .controller('EvidenceGridController', EvidenceGridController);

  // @ngInject
  function evidenceGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        evidence: '=',
        variant: '=',
        source: '=',
        rows: '=',
        showGeneCol: '=',
        showVariantCol: '=',
        context: '=',
        rounded: '='
      },
      templateUrl: 'app/views/events/common/evidenceGrid.tpl.html',
      controller: 'EvidenceGridController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceGridController($scope,
                                  $window,
                                  $stateParams,
                                  $state,
                                  $log,
                                  $filter,
                                  uiGridConstants,
                                  uiGridExporterConstants,
                                  _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};
    var statusFilters = ['accepted', 'submitted'];
    ctrl.context = $scope.context;
    ctrl.showGridKey = false;

    ctrl.keyPopover = {
      templateUrl: 'app/views/events/common/evidenceGridPopoverKey.tpl.html',
      title: 'Evidence Grid Column Key'
    };

    ctrl.exportPopover = {
      templateUrl: 'app/views/events/common/gridExportPopover.tpl.html',
      title: 'Save CSV',
      include: 'all',
      type: 'csv'
    };

    ctrl.tooltipPopupDelay = 500;

    ctrl.evidenceLevels = {
      'A': 'A - Validated',
      'B': 'B - Clinical',
      'C': 'C - Case Study',
      'D': 'D - Preclinical',
      'E': 'E - Inferential'
    };

    ctrl.rowsToShow = $scope.rows === undefined ? 5 : $scope.rows;

    ctrl.evidenceGridOptions = {
      minRowsToShow: ctrl.rowsToShow - 1,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      noUnselect: true,
      modifierKeysToMultiSelect: false,

      // data export
      exporterOlderExcelCompatibility: true,
      exporterHeaderFilter: function( displayName ) {
        // replace short col headers w/ header tooltip strings
        return _.find(ctrl.evidenceGridOptions.columnDefs, { displayName: displayName}).headerTooltip;
      },
      exporterPdfDefaultStyle: {fontSize: 7},
      exporterPdfPageSize: 'LETTER',
      exporterPdfOrientation: 'landscape',

      exporterPdfTableStyle: {
        margin: [0, 0, 0, 0]
      },
      exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'darkgrey'},
      exporterPdfMaxGridWidth: 630,
      exporterPdfTableLayout: 'lightHorizontalLines', // does not appear to have any effect :(

      // grid menu
      exporterMenuCsv: false,
      exporterMenuPdf: false,
      enableGridMenu: true,
      gridMenuShowHideColumns: false,
      appScopeProvider: {
        onDblClick: function(row) {
          console.log('dbl-click!');
          console.log(row);
        }
      },
      rowTemplate: 'app/views/events/common/evidenceGridRowTemplate.tpl.html',
      gridMenuCustomItems: [
        {
          title: 'Show Accepted',
          active: function() {
            return _.includes(statusFilters, 'accepted');
          },
          action: function($event) {
            filterByStatus('accepted', this.grid, $event);
          }
        },
        {
          title: 'Show Submitted',
          active: function() {
            return _.includes(statusFilters, 'submitted');
          },
          action: function($event) {
            filterByStatus('submitted', this.grid, $event);
          }
        },
        {
          title: 'Show Rejected',
          active: function() {
            return _.includes(statusFilters, 'rejected');
          },
          action: function($event) {
            filterByStatus('rejected', this.grid, $event);
          }
        }
      ],
      data: [],
      columnDefs: [
        {
          name: 'status',
          headerTooltip: 'Status',
          displayName: 'ST',
          type: 'string',
          visible: false,
          filter: {
            noTerm: true,
            condition: function(searchTerm, cellValue) {
              return _.includes(statusFilters, cellValue);
            }
          }
        },
        { name: 'id',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'EID',
          headerTooltip: 'Evidence ID',
          type: 'number',
          enableFiltering: true,
          allowCellFocus: false,
          minWidth: 50,
          width: '7%',
          cellTemplate: 'app/views/events/common/evidenceGridIdCell.tpl.html'
        },
        { name: 'gene',
          field: 'state_params.gene.name',
          displayName: 'GENE',
          visible: $scope.showGeneCol,
          headerTooltip: 'Gene',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/common/evidenceGridGeneCell.tpl.html',
          width: '6%'
        },
        { name: 'variant',
          field: 'state_params.variant.name',
          displayName: 'VARIANT',
          visible: $scope.showVariantCol,
          headerTooltip: 'Variant',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/common/evidenceGridVariantCell.tpl.html',
          width: '8%'
        },
        { name: 'description',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DESC',
          headerTooltip: 'Description',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/common/evidenceGridEvidenceCell.tpl.html'
        },
        { name: 'disease',
          field: 'disease.name',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DIS',
          headerTooltip: 'Disease',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/common/evidenceGridDiseaseCell.tpl.html'
        },
        { name: 'druglist',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DRUGS',
          headerTooltip: 'Drugs',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/common/evidenceGridDrugCell.tpl.html'
        },
        { name: 'evidence_level',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'EL',
          headerTooltip: 'Evidence Level',
          type: 'string',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'A', label: 'A - Validated'},
              { value: 'B', label: 'B - Clinical'},
              { value: 'C', label: 'C - Case Study'},
              { value: 'D', label: 'D - Preclinical'},
              { value: 'E', label: 'E - Inferential'}]
          },
          sort: { direction: uiGridConstants.ASC },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridLevelCell.tpl.html'
        },
        { name: 'evidence_type',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'ET',
          headerTooltip: 'Evidence Type',
          type: 'string',
          allowCellFocus: false,
          //enableFiltering: false,
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
        { name: 'evidence_direction',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'ED',
          headerTooltip: 'Evidence Direction',
          type: 'string',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Supports', label: 'Supports' },
              { value: 'Does not Support', label: 'Does not Support' }
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceDirectionCell.tpl.html'
        },
        { name: 'clinical_significance',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'CS',
          headerTooltip: 'Clinical Significance',
          type: 'string',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Sensitivity/Response', label: 'Sensitivity/Response' },
              { value: 'Resistance', label: 'Resistance' },
              { value: 'Better Outcome', label: 'Better Outcome' },
              { value: 'Poor Outcome', label: 'Poor Outcome' },
              { value: 'Positive', label: 'Positive' },
              { value: 'Negative', label: 'Negative' },
              { value: 'Adverse Response', label: 'Adverse Response' },
              { value: 'Reduced Sensitivity', label: 'Reduced Sensitivity' },
              { value: 'Gain of Function', label: 'Gain of Function'},
              { value: 'Loss of Function', label: 'Loss of Function'},
              { value: 'Unaltered Function', label: 'Unaltered Function'},
              { value: 'Neomorphic', label: 'Neomorphic'},
              { value: 'Unknown', label: 'Unknown'},
              { value: 'N/A', label: 'N/A' }
            ]

          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridClinicalSignificanceCell.tpl.html'
        },
        { name: 'variant_origin',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'VO',
          headerTooltip: 'Variant Origin',
          type: 'string',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: 'Somatic Mutation', label: 'Somatic Mutation'},
              { value: 'Germline Mutation', label: 'Germline Mutation' },
              { value: 'Germline Polymorphism', label: 'Germline Polymorphism' },
              { value: 'Unknown', label: 'Unknown' },
              { value: 'N/A', label: 'N/A' },
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridVariantOriginCell.tpl.html'
        },
        { name: 'rating',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          displayName: 'TR',
          headerTooltip: 'Evidence Rating',
          type: 'number',
          allowCellFocus: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: '5', label: '5 stars'},
              { value: '4', label: '4 stars'},
              { value: '3', label: '3 stars'},
              { value: '2', label: '2 stars'},
              { value: '1', label: '1 stars'},
            ]
          },
          sort: { direction: uiGridConstants.DESC },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridRatingCell.tpl.html'
          //cellTemplate: '<div>{{row.entity[col.field]}}</div>'
        },
        {
          name: 'source.phenotypes_list',
          displayName: 'Associated Phenotypes',
          headerTooltip: 'Associated Phenotypes',
          type: 'string',
          visible: false,
          allowCellFocus: false,
          enableFiltering: true
        },
        {
          name: 'source.source_type',
          displayName: 'Source Type',
          headerTooltip: 'Source Type',
          type: 'string',
          visible: false,
          allowCellFocus: false,
          enableFiltering: true
        },
        {
          name: 'source.citation_id',
          displayName: 'Citation ID',
          headerTooltip: 'Citation ID',
          type: 'string',
          visible: false,
          allowCellFocus: false,
          enableFiltering: true
        },
        {
          name: 'source.clinical_trial_ids',
          displayName: 'Clinical Trial IDs',
          headerTooltip: 'Clinical Trial IDs',
          type: 'string',
          visible: false,
          allowCellFocus: false,
          enableFiltering: true
        },

      ]
    };

    function filterByStatus(status, grid) {
      if (_.has(grid.selection.lastSelectedRow, 'entity') &&
        status === 'rejected' &&
        grid.selection.lastSelectedRow.entity.status === 'rejected'
      ) {
        console.warn('Cannot hide rejected items if currently selected item is itself rejected.');
        return;
      }
      if (_.has(grid.selection.lastSelectedRow, 'entity') &&
        status === 'submitted' &&
        grid.selection.lastSelectedRow.entity.status === 'submitted'
      ) {
        console.warn('Cannot hide submitted items if currently selected item is itself submitted.');
        return;
      }

      if(_.includes(statusFilters, status)) {
        _.pull(statusFilters, status);
      } else {
        statusFilters.push(status);
      }
      grid.queueGridRefresh();
    }

    ctrl.evidenceGridOptions.onRegisterApi = function(gridApi){
      ctrl.gridApi = gridApi;
      console.log('----- suppressGo: onRegisterApi init, set to false');
      var suppressGo = false;

      ctrl.evidenceGridOptions.data = prepareEvidence($scope.evidence);

      ctrl.exportData = function() {
        ctrl.evidenceGridOptions.exporterCsvFilename = getFilename($scope.variant);
        var rows = ctrl.exportPopover.include === 'all' ? uiGridExporterConstants.ALL : uiGridExporterConstants.VISIBLE;
        if(ctrl.exportPopover.type === 'csv') {
          gridApi.exporter.csvExport(rows, uiGridExporterConstants.ALL);
        } else {
          gridApi.exporter.pdfExport(rows, uiGridExporterConstants.ALL);
        }
      };

      // setup watcher to update grid
      $scope.$watchCollection('evidence', function(evidence) {
        console.log('ui-grid watchCollection called.');
        // if we get an evidence list that is rejected items only, let's show those instead of showing nothing
        if(_.every(evidence, {status: 'rejected' })) {
          statusFilters = ['accepted', 'submitted', 'rejected'];
        } else if (!_.includes(statusFilters, 'rejected')) {
          statusFilters = ['accepted', 'submitted'];
        }
        if(!_.isUndefined(evidence)) {
          ctrl.gridApi.grid.queueRefresh().then(function() {
            // fixes intermittent bug where col headers wouldn't render on reloaded Search pages
            // forcing data update after a refresh I think prevents the update from interrupting col render
            ctrl.evidenceGridOptions.data = prepareEvidence(evidence);
          });
        }
      });

      // if we're loading an evidence view, highlight the correct row in the table
      gridApi.core.on.rowsRendered($scope, function() {
        console.log('ui-grid onRowsRendered called.');
        if(_.has($stateParams, 'evidenceId')) {
          var rowEntity = _.find($scope.evidence, function (item) {
            return item.id === +$stateParams.evidenceId;
          });

          if(!_.isUndefined(rowEntity)) {
            // if a highlighted row is a rejected item, show rejected items
            if (rowEntity.status === 'rejected') {
              $log.debug('highlight row is for rejected entity.');
              if (!_.includes(statusFilters, 'rejected')) {
                statusFilters.push('rejected');
              }
            }
            console.log('----- suppressGo rowsRendered, set true');
            suppressGo = true;
            gridApi.selection.selectRow(rowEntity);
            gridApi.grid.scrollTo(rowEntity);
            console.log('----- suppressGo post-select, scroll set to false');
            suppressGo = false;
          }
        }
      });


      gridApi.selection.on.rowSelectionChanged($scope, function(row, event){
        console.log('ui-grid onSelectionChanged called.');
        var params = {};
        if($stateParams.geneId !== undefined && $stateParams.variantId !== undefined) {
          params = _.merge($stateParams, { evidenceId: row.entity.id, '#': 'evidence' });

          console.log('----- suppressGo rowSelectionChanged, checking suppressGo: ' + suppressGo);
          // the highlight in onRowsRendered will trigger a state change unless we catch it here
          if(!suppressGo) {
            if(event.metaKey) {
              // if meta key (alt or command) pressed, generate a state URL and open it in a new tab/window
              // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
              // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
              var url = $state.href('events.genes.summary.variants.summary.evidence.summary', params, {absolute: true});
              $window.open(url, '_blank');
            } else {
              $state.go('events.genes.summary.variants.summary.evidence.summary', params);
            }
          }
        } else if (row.entity.state_params !== undefined){
          params = {
            geneId: row.entity.state_params.gene.id,
            variantId: row.entity.state_params.variant.id,
            evidenceId: row.entity.id,
            '#': 'evidence'
          };
          if(!suppressGo) {
            $state.go('events.genes.summary.variants.summary.evidence.summary', params);
          }
        } else {
          console.error('Could not locate gene and variant params for evidence row link!');
        }
      });

      function prepareEvidence(evidence) {
        return _.map(evidence, function(item){
          // convert drug array to string
          if (_.isArray(item.drugs) && item.drugs.length > 0) {
            item.druglist = _.chain(item.drugs).map('name').value().join(', ');
          } else {
            item.druglist = 'N/A';
          }

          // convert clinical trials and associated phenotypes into list
          if (_.isArray(item.source.clinical_trials) && item.source.clinical_trials.length > 0) {
            item.source.clinical_trial_ids = _.chain(item.source.clinical_trials).map('nct_id').value().join(', ');
          } else {
            item.source.clinical_trial_ids = null;
          }
          if (_.isArray(item.source.phenotypes) && item.source.phenotypes.length > 0) {
            item.source.phenotypes_list = _.chain(item.source.phenotypes).without('').map('name').value().join(', ');
          } else {
            item.source.phenotypes_list = null;
          }

          // convert null ratings to zero
          if(item.rating === null || item.rating === undefined) {
            item.rating = 0;
          }
          return item;
        });
      }
      function getFilename(variant) {
        var filename;
        var dateTime = $filter('date')(new Date(), 'yyyy-MM-ddTHH:MM:ss');
        if(_.isUndefined(variant)) {
          filename = 'CIViC_evidence_' + dateTime + '.csv';
        } else {
          filename = 'CIViC_' + variant.name+ '_evidence_' + dateTime + '.csv';
        }
        return filename;
      }
    };
  }

})();
