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
        variant: '='
      },
      templateUrl: 'app/views/events/variants/summary/evidenceGrid.tpl.html',
      controller: 'EvidenceGridController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceGridController($scope, $stateParams, $state, $timeout, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

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

    ctrl.rowsToShow = 5;

    ctrl.evidenceGridOptions = {
      //enablePaginationControls: true,
      //paginationPageSizes: [5],
      //paginationPageSize: 5,
      minRowsToShow: ctrl.rowsToShow - 1,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      columnDefs: [
        { name: 'id',
          displayName: 'EID',
          type: 'number',
          enableFiltering: false,
          allowCellFocus: false,
          minWidth: 50,
          width: '6%'
        },
        { name: 'description',
          displayName: 'DESC',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridEvidenceCell.tpl.html'
        },
        { name: 'disease',
          displayName: 'DIS',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDiseaseCell.tpl.html'
        },
        { name: 'drugs',
          displayName: 'DRUG',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDrugCell.tpl.html'
        },
        //{ name: 'drug_interaction_type',
        //  displayName: 'DI',
        //  type: 'string',
        //  allowCellFocus: false,
        //  enableFiltering: false,
        //  width: '7%,
        //  filter: {
        //    condition: uiGridConstants.filter.CONTAINS
        //  },
        //  cellTemplate: 'app/views/events/variants/summary/evidenceGridDrugInteractionTypeCell.tpl.html'
        //},
        { name: 'evidence_type',
          displayName: 'ET',
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
        { name: 'evidence_level',
          displayName: 'EL',
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
        { name: 'evidence_direction',
          displayName: 'ED',
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
          displayName: 'CS',
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
          displayName: 'VO',
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
          displayName: 'TR',
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

    ctrl.evidenceGridOptions.onRegisterApi = function(gridApi){
      // TODO: this watch seems unnecessary, but if it's not present then the grid only loads on a fresh page, fails when loaded by a state change
      // Something to do with directive priorities, maybe?
      $scope.$watchCollection('evidence', function(evidence) {
        ctrl.gridApi = gridApi;
        ctrl.evidenceGridOptions.minRowsToShow = evidence.length + 1;
        // convert drug array into comma delimited list
        evidence = _.map(evidence, function(item){
          if (_.isArray(item.drugs)) {
            item.drugs = _.chain(item.drugs).pluck('name').value().join(', ');
            return item;
          } else {
            return item;
          }
        });
        ctrl.evidenceGridOptions.data = evidence;

        // if we're loading an evidence view, highlight the correct row in the table
        if(_.has($stateParams, 'evidenceId')) {
          var rowEntity = _.find(evidence, function(item) {
            return item.id === +$stateParams.evidenceId;
          });

          gridApi.core.on.rowsRendered($scope, function() {
            gridApi.selection.selectRow(rowEntity);
            gridApi.grid.scrollTo(rowEntity);
          });
        }

        gridApi.selection.on.rowSelectionChanged($scope, function(row){
          var params = _.merge($stateParams, { evidenceId: row.entity.id });
          $state.go('events.genes.summary.variants.summary.evidence.summary', params);
        });

      });

    };
  }

})();
