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
      content: 'Hello, World!',
      //templateUrl: 'myPopoverTemplate.html',
      templateUrl: 'app/views/events/variants/summary/evidenceGridPopoverKey.tpl.html',
      title: 'Evidence Grid Column Key'
    };

    ctrl.evidenceGridOptions = {
      enablePaginationControls: true,
      paginationPageSizes: [5],
      paginationPageSize: 5,
      minRowsToShow: 5,

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
      rowTemplate: 'app/views/events/variants/summary/evidenceGridRow.tpl.html',
      columnDefs: [
        { name: 'id',
          displayName: 'EID',
          type: 'number',
          enableFiltering: false,
          allowCellFocus: false,
          minWidth: 45,
          width: '7%'
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
        //  width: '5%',
        //  filter: {
        //    condition: uiGridConstants.filter.CONTAINS
        //  },
        //  cellTemplate: 'app/views/events/variants/summary/evidenceGridDrugInteractionTypeCell.tpl.html'
        //},
        { name: 'evidence_level',
          displayName: 'EL',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: false,
          sort: { direction: uiGridConstants.ASC },
          width: '5%',
          minWidth: 45,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridLevelCell.tpl.html'
        },
        { name: 'evidence_type',
          displayName: 'ET',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: false,
          width: '5%',
          minWidth: 45,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridTypeCell.tpl.html'
        },
        { name: 'clinical_significance',
          displayName: 'CS',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: false,
          width: '5%',
          minWidth: 45,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridClinicalSignificanceCell.tpl.html'
        },
        { name: 'variant_origin',
          displayName: 'VO',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: false,
          width: '5%',
          minWidth: 45,
          cellTemplate: 'app/views/events/variants/summary/evidenceGridVariantOriginCell.tpl.html'
        },
        { name: 'rating',
          displayName: 'TR',
          type: 'number',
          allowCellFocus: false,
          enableFiltering: false,
          sort: { direction: uiGridConstants.DESC },
          width: '5%',
          minWidth: 45,
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
        //if(_.has($stateParams, 'evidenceId')) {
        //  var rowEntity = _.find($scope.evidence, function(item) {
        //    return item.id === +$stateParams.evidenceId;
        //  });
        //
        //
        //  gridApi.core.on.rowsRendered($scope, function() {
        //    gridApi.selection.selectRow(rowEntity);
        //  });
        //
        //  var pageSet= false;
        //  gridApi.selection.on.rowSelectionChanged($scope, function() {
        //    console.log('on.rowSelectionChanged -----');
        //    if(!pageSet) {
        //      $timeout(function () {
        //        var row = _.findIndex(ctrl.evidenceGridOptions.data, function (item) {
        //          return item.id === +$stateParams.evidenceId;
        //        });
        //        var page = Math.floor(row / ctrl.evidenceGridOptions.paginationPageSize);
        //        gridApi.pagination.seek(page);
        //        pageSet = true;
        //      });
        //    }
        //  });
        //
        //
        //}

        gridApi.selection.on.rowSelectionChanged($scope, function(row){
          var params = _.merge($stateParams, { evidenceId: row.entity.id });
          $state.go('events.genes.summary.variants.summary.evidence.summary', params);
        });

      });

    };
  }

})();
