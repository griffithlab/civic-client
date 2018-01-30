(function() {
  'use strict';

  /**
   * Renders an data grid of evidence items, the last column containing a button labeled either 'Add' or 'Remove',
   * depending on if the grid's mode is specified as 'search' or 'list'. Clicking 'Add' will add the evidence item object
   * to the array provided to the 'items' attribute. Clicking 'Remove' will remove the item's object from the 'items' array.
   * Obviously two grids need to operate in tandem to be of much use, so this grid will likely be utlilized by a more abstract
   * component that renders both grids.
   *
   * @param {string} role - Either 'browse' or 'list'.
   * @param {array} items - Array containing the list of evidence item objects manipulated by the grids.
   */

  angular.module('civic.events')
    .directive('evidenceSelector', evidenceSelector)
    .controller('EvidenceSelectorController', EvidenceSelectorController);

  // @ngInject
  function evidenceSelector() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        mode: '=',
        items: '='
      },
      templateUrl: 'app/views/events/common/evidenceSelector/evidenceSelector.tpl.html',
      controller: 'EvidenceSelectorController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceSelectorController($scope,
                                      $state,
                                      $window,
                                      uiGridConstants,
                                      Datatables,
                                      Evidence,
                                      _) {
    var ctrl = $scope.ctrl = {};

    var pageCount = 5;
    var maxRows = ctrl.maxRows = pageCount;

    // declare ui paging/sorting/filtering vars
    ctrl.mode = $scope.mode;
    ctrl.totalItems = Number();
    ctrl.page = 1;
    ctrl.count= maxRows;

    ctrl.filters = [];

    ctrl.sorting = [{
      field: 'id',
      direction: 'asc'
    }];

    $scope.$watch('ctrl.totalItems', function() {
      ctrl.totalPages = Math.ceil(ctrl.totalItems / pageCount);
    });

    var evidence_levels = {
      A: 'Validated',
      B: 'Clinical',
      C: 'Case Study',
      D: 'Preclinical',
      E: 'Inferential'
    };

    ctrl.addItem = function(rowItem) {
      Evidence.get(rowItem.id).then(function(item) {
        $scope.items.unshift(item);
      });
    };

    $scope.$watchCollection('items', function(items) {
      _.each(items, function(item) {
        if(_.isUndefined(item.evidence_level_string)){
          item.evidence_level_string = item.evidence_level + ' - ' + evidence_levels[item.evidence_level];
          if(item.drugs.length > 0) {
            item.drugsStr = _.chain(item.drugs).map('name').value().join(', ');
          } else {
            item.drugsStr = 'N/A';
          }
        }
      });
    });

    ctrl.removeItem = function(item) {
      $scope.items = _.reject($scope.items, {id: item.id});
    };

    ctrl.isInItems = function(id){
      return _.some($scope.items, { 'id': id});
    };

    ctrl.gridOptions = {
      enablePaginationControls: false,

      useExternalFiltering: true,
      useExternalSorting: true,
      useExternalPaging: true,

      paginationPageSizes: [maxRows],
      paginationPageSize: maxRows,
      minRowsToShow: maxRows,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,

      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      rowTemplate: 'app/views/events/common/evidenceSelector/evidenceSelectorRowTemplate.tpl.html'
    };

    // set up column defs and data transforms for each mode
    var modeColumnDefs = {
      'browse': [
                {
          name: 'id',
          displayName: 'EID',
          visible: true,
          type: 'number',
          enableSorting: true,
          enableFiltering: true,
          headerTooltip: 'Evidence ID',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          minWidth: 50,
          width: '5%'
        },
        {
          name: 'gene_name',
          displayName: 'GENE',
          enableFiltering: true,
          allowCellFocus: false,
          headerTooltip: 'Gene Entrez Name',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/evidenceGridGeneCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '6%'
        },
        {
          name: 'variant_name',
          displayName: 'VARIANT',
          enableFiltering: true,
          allowCellFocus: false,
          headerTooltip: 'Variant Name',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/evidenceGridVariantCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '8%'
        },
        {
          name: 'description',
          displayName: 'DESC',
          headerTooltip: 'Description',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/evidenceGridEvidenceCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'disease',
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
          name: 'drugs',
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
          name: 'evidence_level',
          enableFiltering: true,
          allowCellFocus: false,
          displayName: 'EL',
          headerTooltip: 'Evidence Level',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/evidenceGridLevelCell.tpl.html',
          width: '6%',
          minWidth: 50,
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
          }
        },
        {
          name: 'evidence_type',
          displayName: 'ET',
          headerTooltip: 'Evidence Type',
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
              }
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridTypeCell.tpl.html'
        },
        {
          name: 'evidence_direction',
          displayName: 'ED',
          headerTooltip: 'Evidence Direction',
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
              { value: 'Sensitivity', label: 'Sensitivity' },
              { value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
              { value: 'Better Outcome', label: 'Better Outcome' },
              { value: 'Poor Outcome', label: 'Poor Outcome' },
              { value: 'Positive', label: 'Positive' },
              { value: 'Negative', label: 'Negative' },
              { value: 'Adverse Response', label: 'Adverse Response' },
              { value: 'N/A', label: 'N/A' }
            ]
          },
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridClinicalSignificanceCell.tpl.html'
        },
        {
          name: 'variant_origin',
          displayName: 'VO',
          headerTooltip: 'Variant Origin',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
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
        {
          name: 'rating',
          displayName: 'TR',
          headerTooltip: 'Trust Rating',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
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
          width: '6%',
          minWidth: 50,
          cellTemplate: 'app/views/events/common/evidenceGridRatingCell.tpl.html'
        },
        {
          name: 'action_add',
          displayName: '',
          width: '40',
          allowCellFocus: false,
          enableFiltering: false,
          cellTemplate: 'app/views/events/common/evidenceSelector/evidenceSelectorAddCell.tpl.html'
        }
      ],
      'list': [
        {
          name: 'description',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'gene_name',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant_name',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'disease',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'drugs',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS,
          }
        },
        {
          name: 'evidence_level',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          displayName: 'EL',
          headerTooltip: 'Evidence Level',
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
        },
        {
          name: 'evidence_type',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          displayName: 'ET',
          headerTooltip: 'Evidence Type',
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
              }
            ]
          },
        },
        {
          name: 'evidence_direction',
          displayName: 'ED',
          headerTooltip: 'Evidence Direction',
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
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
        },
        {
          name: 'clinical_significance',
          displayName: 'CS',
          headerTooltip: 'Clinical Significance',
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
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
              { value: 'Adverse Response', label: 'Adverse Response' },
              { value: 'N/A', label: 'N/A' }
            ]
          },
        },
        {
          name: 'variant_origin',
          displayName: 'VO',
          headerTooltip: 'Variant Origin',
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
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
        },
        {
          name: 'rating',
          displayName: 'TR',
          headerTooltip: 'Trust Rating',
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
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
        },
        {
          name: 'action_remove',
          displayName: '',
          width: '70',
          allowCellFocus: false,
          enableFiltering: false,
          cellTemplate: 'app/views/events/common/evidenceSelector/evidenceSelectorRemoveCell.tpl.html'
        }
      ]
    };

    ctrl.gridOptions.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      // called from pagination directive when page changes
      ctrl.pageChanged = function() {
        updateData();
      };

      // reset paging and do some other stuff on filter changes
      gridApi.core.on.filterChanged($scope, function() {
        // updateData with new filters
        var filteredCols = _.filter(this.grid.columns, function(col) {
          return _.has(col.filter, 'term') && !_.isEmpty(col.filter.term) && _.isString(col.filter.term);
        });
        if (filteredCols.length > 0) {
          ctrl.filters = _.map(filteredCols, function(col) {
            return {
              'field': col.field,
              'term': col.filter.term
            };
          });
        } else {
          ctrl.filters = [];
        }
        ctrl.page = 1;
        updateData();
      });

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length > 0) {
          ctrl.sorting = _.map(sortColumns, function(col) {
            return {
              'field': col.field,
              'direction': col.sort.direction
            };
          });
        } else {
          ctrl.sorting = [];
        }
        updateData();
      });

    };

    function updateData() {
      fetchData(ctrl.mode, ctrl.count, ctrl.page, ctrl.sorting, ctrl.filters)
        .then(function(data){
          ctrl.gridOptions.data = data.result;
          ctrl.gridOptions.columnDefs = modeColumnDefs[ctrl.mode];
          ctrl.totalItems = data.total;
        });
    }

    function fetchData(mode, count, page, sorting, filters) {
      var request;

      request= {
        mode: 'evidence_items',
        count: count,
        page: page
      };

      if (filters.length > 0) {
        _.each(filters, function(filter) {
          request['filter[' + filter.field + ']'] = filter.term;
        });
      }

      if (sorting.length > 0) {
        _.each(sorting, function(sort) {
          request['sorting[' + sort.field + ']'] = sort.direction;
        });
      }
      return Datatables.query(request);
    }

    updateData();
  }
})();
