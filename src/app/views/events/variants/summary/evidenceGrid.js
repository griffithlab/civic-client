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
        rows: '=',
        showGeneCol: '=',
        showVariantCol: '=',
        context: '=',
        rounded: '='
      },
      templateUrl: 'app/views/events/variants/summary/evidenceGrid.tpl.html',
      controller: 'EvidenceGridController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceGridController($scope, $stateParams, $state, $log, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};
    var statusFilters = ['accepted', 'submitted'];
    ctrl.showGridKey = false;

    ctrl.keyPopover = {
      templateUrl: 'app/views/events/variants/summary/evidenceGridPopoverKey.tpl.html',
      title: 'Evidence Grid Column Key'
    };

    ctrl.tooltipPopupDelay = 500;

    ctrl.evidenceLevels = {
      'A': 'A - Validated',
      'B': 'B - Clinical',
      'C': 'C - Preclinical',
      'D': 'D - Case Study',
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

      // grid menu
      enableGridMenu: true,
      gridMenuShowHideColumns: false,
      gridMenuCustomItems: [
        {
          title: 'Show Accepted',
          active: function() {
            return _.contains(statusFilters, 'accepted');
          },
          action: function($event) {
            filterByStatus('accepted', this.grid, $event);
          }
        },
        {
          title: 'Show Submitted',
          active: function() {
            return _.contains(statusFilters, 'submitted');
          },
          action: function($event) {
            filterByStatus('submitted', this.grid, $event);
          }
        },
        {
          title: 'Show Rejected',
          active: function() {
            return _.contains(statusFilters, 'rejected');
          },
          action: function($event) {
            filterByStatus('rejected', this.grid, $event);
          }
        }
      ],
      columnDefs: [
        {
          name: 'status',
          displayName: 'ST',
          type: 'string',
          visible: false,
          filter: {
            noTerm: true,
            condition: function(searchTerm, cellValue) {
              return _.contains(statusFilters, cellValue);
            }
          }
        },
        { name: 'id',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'EID',
          headerTooltip: 'Evidence ID',
          type: 'number',
          enableFiltering: false,
          allowCellFocus: false,
          minWidth: 50,
          width: '6%',
          cellTemplate: 'app/views/events/variants/summary/evidenceGridIdCell.tpl.html'
        },
        { name: 'gene',
          field: 'state_params.gene.name',
          displayName: 'GENE',
          visible: $scope.showGeneCol,
          headerTooltip: 'Gene',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          width: '6%'
        },
        { name: 'variant',
          field: 'state_params.variant.name',
          displayName: 'VARIANT',
          visible: $scope.showVariantCol,
          headerTooltip: 'Variant',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          width: '8%'
        },
        { name: 'description',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DESC',
          headerTooltip: 'Description',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridEvidenceCell.tpl.html'
        },
        { name: 'disease',
          field: 'disease.name',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DIS',
          headerTooltip: 'Disease',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDiseaseCell.tpl.html'
        },
        { name: 'drugs',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'DRUG',
          headerTooltip: 'Drug',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDrugCell.tpl.html'
        },
        { name: 'evidence_level',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
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
              { value: 'C', label: 'C - Preclinical'},
              { value: 'D', label: 'D - Case Study'},
              { value: 'E', label: 'E - Inferential'}]
          },
          sort: { direction: uiGridConstants.ASC },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridLevelCell.tpl.html'
        },
        { name: 'evidence_type',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
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
              }
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridTypeCell.tpl.html'
        },
        { name: 'evidence_direction',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
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
          cellTemplate: 'app/views/events/variants/summary/evidenceDirectionCell.tpl.html'
        },
        { name: 'clinical_significance',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
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
              { value: 'Sensitivity', label: 'Sensitivity' },
              { value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
              { value: 'Better Outcome', label: 'Better Outcome' },
              { value: 'Poor Outcome', label: 'Poor Outcome' },
              { value: 'Positive', label: 'Positive' },
              { value: 'Negative', label: 'Negative' },
            ]

          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridClinicalSignificanceCell.tpl.html'
        },
        { name: 'variant_origin',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
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
              { value: 'Somatic', label: 'Somatic'},
              { value: 'Germline', label: 'Germline' }
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridVariantOriginCell.tpl.html'
        },
        { name: 'rating',
          headerCellTemplate: 'app/views/events/variants/summary/evidenceGridTooltipHeader.tpl.html',
          displayName: 'TR',
          headerTooltip: 'Trust Rating',
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
          cellTemplate: 'app/views/events/variants/summary/evidenceGridRatingCell.tpl.html'
          //cellTemplate: '<div>{{row.entity[col.field]}}</div>'
        }
      ]
    };

    function filterByStatus(status, grid, event) {
      if (grid.selection.lastSelectedRow.entity.status === 'rejected') {
        console.warn('Cannot hide rejected items if currently selected item is itself rejected.');
        return;
      }
      if(_.contains(statusFilters, status)) {
        _.pull(statusFilters, status);
      } else {
        statusFilters.push(status);
      }
      grid.queueGridRefresh();
    }

    ctrl.evidenceGridOptions.onRegisterApi = function(gridApi){
      var evidence = $scope.evidence;
      ctrl.gridApi = gridApi;
      ctrl.evidenceGridOptions.minRowsToShow = evidence.length + 1;
      var suppressGo = false;

      // convert drug array into comma delimited list
      evidence = prepareDrugArray(evidence);

      // assign evidence data to grid
      ctrl.evidenceGridOptions.data = evidence;

      // setup watcher to update grid
      $scope.$watchCollection('evidence', function(evidence) {
        // if we get an evidence list that is rejected items only, let's show those instead of showing nothing
        if(_.every(evidence, 'status', 'rejected')) {
          statusFilters = ['accepted', 'submitted', 'rejected'];
        } else if (!_.includes(statusFilters, 'rejected')) {
          statusFilters = ['accepted', 'submitted'];
        }
        ctrl.evidenceGridOptions.data = prepareDrugArray(evidence);
      });

      // if we're loading an evidence view, highlight the correct row in the table
      gridApi.core.on.rowsRendered($scope, function() {
        if(_.has($stateParams, 'evidenceId')) {
          var rowEntity = _.find($scope.evidence, function (item) {
            return item.id === +$stateParams.evidenceId;
          });

          // if a highlighted row is a rejected item, show rejected items
          if(rowEntity.status === 'rejected') {
            $log.debug('highlight row is for rejected entity.');
            if(!_.includes(statusFilters, 'rejected')) {
              statusFilters.push('rejected');
            }
          }

          suppressGo = true;
          gridApi.selection.selectRow(rowEntity);
          gridApi.grid.scrollTo(rowEntity);
          suppressGo = false;
        }
      });


      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        var params = {};
        if($stateParams.geneId !== undefined && $stateParams.variantId !== undefined) {
          params = _.merge($stateParams, { evidenceId: row.entity.id, '#': 'evidence' });

          // the highlight in onRowsRendered will trigger a state change unless we catch it here
          if(!suppressGo) {
            $state.go('events.genes.summary.variants.summary.evidence.summary', params);
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

      function prepareDrugArray(evidence) {
        return _.map(evidence, function(item){
          if (_.isArray(item.drugs)) {
            item.drugs = _.chain(item.drugs).pluck('name').value().join(', ');
            return item;
          } else {
            return item;
          }
        });
      }
    };
  }

})();
