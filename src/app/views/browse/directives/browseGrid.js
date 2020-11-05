(function() {
  'use strict';
  angular.module('civic.events')
    .directive('browseGrid', browseGrid)
    .controller('BrowseGridController', BrowseGridController);

  // @ngInject
  function browseGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        mode: '=',
        page: '='
      },
      templateUrl: 'app/views/browse/directives/browseGrid.tpl.html',
      controller: 'BrowseGridController'
    };
    return directive;
  }

  // @ngInject
  function BrowseGridController($scope,
                                $state,
                                $window,
                                $location,
                                uiGridConstants,
                                Datatables,
                                _) {
    var ctrl = $scope.ctrl = {};

    var pageCount = 25;
    var maxRows = ctrl.maxRows = pageCount;

    // declare ui paging/sorting/filtering vars
    ctrl.mode = $scope.mode;
    ctrl.totalItems = Number();
    ctrl.page = $scope.page;
    ctrl.count = pageCount;

    ctrl.filters = [];

    if(ctrl.mode == 'evidence_items') {
      ctrl.sorting = [
        {
          field: 'evidence_level',
          direction: 'asc',
        },
        {
          field: 'rating',
          direction: 'desc',
        },
        {
          field: 'evidence_type',
          direction: 'asc',
        },
      ];
    } else if(ctrl.mode == 'variants') {
      ctrl.sorting = [{
        field: 'civic_actionability_score',
        direction: 'desc',
      }];
    } else {
      ctrl.sorting = [{
        field: 'evidence_item_count',
        direction: 'desc'
      }];
    }

    $scope.$watch('ctrl.totalItems', function() {
      ctrl.totalPages = Math.ceil(ctrl.totalItems / pageCount);
    });

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
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      rowTemplate: 'app/views/browse/directives/browseGridRow.tpl.html'
    };

    // set up column defs and data transforms for each mode
    var modeColumnDefs = {
      'assertions': [
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
          name: 'gene_name',
          displayName: 'Gene',
          enableFiltering: true,
          allowCellFocus: false,
          headerTooltip: 'Gene Entrez Name',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/evidenceGridGeneCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '10%'
        },
        {
          name: 'variant_name',
          displayName: 'Variant',
          enableFiltering: true,
          allowCellFocus: false,
          headerTooltip: 'Variant Name',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/evidenceGridVariantCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '15%'
        },
        {
          name: 'disease',
          displayName: 'Disease',
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
          displayName: 'Drugs',
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
          headerTooltip: 'Summary',
          width: '6%',
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
          name: 'amp_level_short',
          displayName: 'AMP/ASCO/CAP Category',
          enableFiltering: true,
          allowCellFocus: false,
          headerTooltip: 'AMP/ASCO/CAP Category',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/assertionGrid/assertionGridAmpCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          width: '3%'
        },
        {
          name: 'evidence_item_count',
          width: '8%',
          displayName: 'Evidence',
          sort: {
            direction: uiGridConstants.DESC
          },
          enableFiltering: false,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/common/assertionGrid/assertionGridEvidenceCell.tpl.html'
        }
      ],
      'evidence_items': [
        {
          name: 'status',
          headerTooltip: 'Status',
          displayName: 'ST',
          type: 'string',
          visible: false
        },
        {
          name: 'id',
          displayName: 'EID',
          visible: true,
          type: 'number',
          enableSorting: true,
          enableFiltering: true,
          headerTooltip: 'Evidence ID',
          headerCellTemplate: 'app/views/events/common/evidenceGridTooltipHeader.tpl.html',
          cellTemplate: 'app/views/events/common/evidenceGridIdCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          minWidth: 75,
          width: '5%'
        },
        {
          name: 'gene_name',
          displayName: 'Gene',
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
          displayName: 'Variant',
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
          displayName: 'Description',
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
          displayName: 'Disease',
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
          displayName: 'Drugs',
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
              { value: 'Does Not Support', label: 'Does not Support' },
              { value: 'N/A', label: 'N/A' }
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
              { value: 'Gain of Function', label: 'Gain of Function'},
              { value: 'Loss of Function', label: 'Loss of Function'},
              { value: 'Unaltered Function', label: 'Unaltered Function'},
              { value: 'Neomorphic', label: 'Neomorphic'},
              { value: 'Dominant Negative', label: 'Dominant Negative' },
              { value: 'Unknown', label: 'Unknown'},
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
              { value: 'Somatic', label: 'Somatic'},
              { value: 'Rare Germline', label: 'Rare Germline' },
              { value: 'Common Germline', label: 'Common Germline' },
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
          displayName: 'ER',
          headerTooltip: 'Evidence Rating',
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
      ],
      'variants': [
        {
          name: 'variant',
          width: '15%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'entrez_gene',
          width: '9%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'diseases',
          displayName: 'Diseases',
          width: '23%',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html'
        },
        {
          name: 'drugs',
          displayName: 'Drugs',
          width: '23%',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html'
        },
        {
          name: 'evidence_item_count',
          width: '8%',
          displayName: 'Evidence',
          enableFiltering: false,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'assertion_count',
          width: '9%',
          displayName: 'Assertions',
          enableFiltering: false,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'civic_actionability_score',
          width: '13%',
          displayName: 'Evidence Score',
          enableFiltering: false,
          allowCellFocus: false,
          sort: {
            direction: uiGridConstants.DESC
          },
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
      ],
      'genes': [
        {
          name: 'name',
          width: '10%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'gene_aliases',
          width: '30%',
          displayName: 'Gene Aliases',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'diseases',
          //width: '30%',
          displayName: 'Diseases',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html'
        },
        {
          name: 'drugs',
          //width: '30%',
          displayName: 'Drugs',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html'
        },
        {
          name: 'variant_count',
          displayName: 'Variants',
          width: '10%',
          enableFiltering: false,
          allowCellFocus: false,
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
        },
        {
          name: 'assertion_count',
          width: '10%',
          displayName: 'Assertions',
          enableFiltering: false,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
      ],
      'variant_groups': [
        {
          name: 'name',
          displayName: 'Name',
          width: '20%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variants',
          displayName: 'Variants',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html'
        },
        {
          name: 'variant_count',
          displayName: 'Count',
          width: '7%',
          enableFiltering: false,
          allowCellFocus: false
        },
        {
          name: 'entrez_genes',
          displayName: 'Genes',
          width: '23%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item_count',
          type: 'number',
          displayName: 'Evidence',
          width: '10%',
          enableFiltering: false,
          allowCellFocus: false,
          sort: { direction: uiGridConstants.DESC },
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ],
      'sources': [
        {
          name: 'source_type',
          displayName: 'Type',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          type: 'string',
          width: '8%',
          filter: {
            type: uiGridConstants.filter.SELECT,
            term: null,
            disableCancelFilterButton: false,
            selectOptions: [
              { value: null, label: '--' },
              { value: '0', label: 'PubMed'},
              { value: '1', label: 'ASCO'}
             ]
          }
        },
        {
          name: 'citation_id',
          displayName: 'Citation ID',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          type: 'string',
          width: '8%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'author_list',
          displayName: 'Authors',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '15%',
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'publication_year',
          displayName: 'Year',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html',
          width: '8%'
        },
        {
          name: 'journal',
          displayName: 'Journal',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          width: '12%',
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'name',
          displayName: 'Name',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          cellTemplate: 'app/views/browse/directives/browseGridTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item_count',
          type: 'number',
          displayName: 'Evidence',
          width: '10%',
          enableFiltering: false,
          allowCellFocus: false,
          sort: { direction: uiGridConstants.DESC }
        }
      ]
    };

    ctrl.gridOptions.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      // called from pagination directive when page changes
      ctrl.pageChanged = function() {
        $location.search('page', ctrl.page);
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

      // called when user clicks on a row
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event){
        var state = '';
        var params = {};
        if(ctrl.mode === 'variants') {
          state = 'events.genes.summary.variants.summary';
          params = {
            geneId: row.entity.gene_id,
            variantId: row.entity.variant_id,
            '#': 'variant'
          };
        } else if (ctrl.mode === 'genes'){
          state = 'events.genes.summary';
          params = {
            geneId: row.entity.id,
            '#': 'gene'
          };
        } else if (ctrl.mode === 'variant_groups') {
          state = 'events.genes.summary.variantGroups.summary';
          params = {
            geneId: row.entity.gene_ids.split(', ')[0],
            variantGroupId: row.entity.id,
            '#': 'variant-group'
          };
        } else if (ctrl.mode === 'sources') {
          state = 'sources.summary';
          params = {
            sourceId: row.entity.id
          };
        } else if (ctrl.mode === 'assertions') {
          state = 'events.assertions.summary';
          params = {
            assertionId: row.entity.id
          };
        } else if (ctrl.mode === 'evidence_items') {
          state = 'events.genes.summary.variants.summary.evidence.summary';
          params = {
            geneId: row.entity.gene_id,
            variantId: row.entity.variant_id,
            evidenceId: row.entity.id,
            '#': 'evidence'
          };
        }

        if(event.metaKey) {
          // if meta key (alt or command) pressed, generate a state URL and open it in a new tab/window
          // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
          // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
          var url = $state.href(state, params, {absolute: true});
          $window.open(url, '_blank');
        } else {
          $state.go(state, params);
        }

      });
    };

    function updateData() {
      fetchData(ctrl.mode, ctrl.count, ctrl.page, ctrl.sorting, ctrl.filters)
        .then(function(data){
          if(ctrl.mode === 'variant_groups') {
            // add variant_count attribute
            _.forEach(data.result, function(variant_group) {
              variant_group.variant_count = variant_group.variants.split(', ').length;
              return variant_group;
            });
            ctrl.gridOptions.data = data.result;
          } else {
            ctrl.gridOptions.data = data.result;
          }
          ctrl.gridOptions.columnDefs = modeColumnDefs[ctrl.mode];
          ctrl.totalItems = data.total;
        });
    }

    function fetchData(mode, count, page, sorting, filters) {
      var request;

      request= {
        mode: mode,
        count: count,
        page: page
      };

      if (filters.length > 0) {
        _.each(filters, function(filter) {
          request['filter[' + filter.field + ']'] = filter.term;
        });
      }

      if (sorting.length > 0) {
        request.sort_priority = '';
        var length = sorting.length;
        _.each(sorting, function(sort, index) {
          request['sorting[' + sort.field + ']'] = sort.direction;
          request.sort_priority += sort.field;
          if (index+1 < length) { request.sort_priority += ',';}
        });
      }
      return Datatables.query(request);
    }

    updateData();
  }
})();
