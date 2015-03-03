(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceGrid', evidenceGrid)
    .controller('EvidenceGridCtrl', EvidenceGridCtrl);

  // @ngInject
  function evidenceGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: false,
      templateUrl: 'app/views/events/variants/directives/evidenceGrid.tpl.html',
      controller: 'EvidenceGridCtrl'
    };
    return directive;
  }

  // @ngInject
  function EvidenceGridCtrl($scope, uiGridConstants, $stateParams, $state, $timeout, $log, _) {
    /*jshint camelcase: false */
    $scope.evidenceGridOptions = {
      enablePaginationControls: true,
      paginationPageSizes: [8],
      paginationPageSize: 8,
      minRowsToShow: 9,

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
      rowTemplate: 'app/views/events/variants/directives/evidenceGridRow.tpl.html',
      columnDefs: [
        { name: 'text',
          displayName: 'Supporting Evidence',
          enableFiltering: true,
          allowCellFocus: false,
          width: '50%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/directives/evidenceGridEvidenceCell.tpl.html'
        },
        { name: 'disease',
          displayName: 'Disease',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/directives/evidenceGridDiseaseCell.tpl.html'
        },
        { name: 'drug',
          displayName: 'Drug',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/directives/evidenceGridDrugCell.tpl.html'
        },
        { name: 'evidence_level',
          displayName: 'Level',
          allowCellFocus: false,
          enableFiltering: true,
          sort: { direction: uiGridConstants.ASC },
          width: '8%',
          cellTemplate: 'app/views/events/variants/directives/evidenceGridLevelCell.tpl.html'
        },
        { name: 'rating',
          displayName: 'Rating',
          allowCellFocus: false,
          enableFiltering: false,
          sort: { direction: uiGridConstants.DESC },
          width: '15%',
          cellTemplate: 'app/views/events/variants/directives/evidenceGridRatingCell.tpl.html'
          //cellTemplate: '<div>{{row.entity[col.field]}}</div>'
        }
      ]
    };

    $scope.evidenceGridOptions.onRegisterApi = function(gridApi){

      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        $state.go('events.genes.summary.variants.summary.evidence.summary', {
          geneId: $scope.gene.entrez_id,
          variantId: $scope.variant.id,
          evidenceItemId: row.entity.id
        });
      });

      // fetch variant data
      $scope.variant.$promise.then(function(variant) {
        $scope.evidenceGridOptions.minRowsToShow = variant.evidence_items.length + 1;
        $scope.evidenceGridOptions.data = variant.evidence_items;
        // if evidenceItemId specified in state, scroll to evidence item's row and select it
        if(_.has($stateParams, 'evidenceItemId')) {
          var rowEntity = _.find(variant.evidence_items, function(item) {
            return item.id == $stateParams.evidenceItemId;
          });

          $timeout(function() { // need timeout here until ui-grid adds a 'data rendered' event
            gridApi.selection.selectRow(rowEntity);
            gridApi.cellNav.scrollTo( gridApi.grid, $scope, rowEntity, $scope.evidenceGridOptions.columnDefs[0]);
          }, 500);
        }
      });
    };
  }

})();
