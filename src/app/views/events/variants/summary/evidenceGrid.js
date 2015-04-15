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
        evidenceItems: '=',
        variant: '=',
        geneId: '='
      },
      templateUrl: 'app/views/events/variants/summary/evidenceGrid.tpl.html',
      controller: 'EvidenceGridController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceGridController($scope, $stateParams, $state, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

    ctrl.evidenceGridOptions = {
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
      rowTemplate: 'app/views/events/variants/summary/evidenceGridRow.tpl.html',
      columnDefs: [
        { name: 'text',
          displayName: 'Supporting Evidence',
          enableFiltering: true,
          allowCellFocus: false,
          width: '50%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridEvidenceCell.tpl.html'
        },
        { name: 'disease',
          displayName: 'Disease',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDiseaseCell.tpl.html'
        },
        { name: 'drug',
          displayName: 'Drug',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/variants/summary/evidenceGridDrugCell.tpl.html'
        },
        { name: 'evidence_level',
          displayName: 'Level',
          allowCellFocus: false,
          enableFiltering: true,
          sort: { direction: uiGridConstants.ASC },
          width: '8%',
          cellTemplate: 'app/views/events/variants/summary/evidenceGridLevelCell.tpl.html'
        },
        { name: 'rating',
          displayName: 'Rating',
          allowCellFocus: false,
          enableFiltering: false,
          sort: { direction: uiGridConstants.DESC },
          width: '15%',
          cellTemplate: 'app/views/events/variants/summary/evidenceGridRatingCell.tpl.html'
          //cellTemplate: '<div>{{row.entity[col.field]}}</div>'
        }
      ]
    };

    ctrl.evidenceGridOptions.onRegisterApi = function(gridApi){
      ctrl.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        //var path, newPath;
        //path  = $location.path();
        //newPath = path + '/evidence/' + String(row.entity.id) + '/summary';
        //$location.path(newPath);
        $state.go('events.genes.summary.variants.summary.evidence.summary', {
          geneId: $scope.geneId,
          variantId: $scope.variant.id,
          evidenceId: row.entity.id
        });
      });

      // TODO: refactor this, do we really need a watcher here?
      var unwatch = $scope.$watch('variant', function() {
        $scope.variant.$promise.then(function(variant) {
          ctrl.evidenceGridOptions.minRowsToShow = $scope.evidenceItems.length + 1;
          ctrl.evidenceGridOptions.data = $scope.evidenceItems;
          // if evidenceItemId specified in state, scroll to evidence item's row and select it
          if(_.has($stateParams, 'evidenceItemId')) {
            var rowEntity = _.find($scope.evidenceItems, function(item) {
              return item.id === +$stateParams.evidenceItemId;
            });
            gridApi.core.on.rowsRendered($scope, function() {
              gridApi.selection.selectRow(rowEntity);
              gridApi.cellNav.scrollTo( gridApi.grid, $scope, rowEntity, $scope.evidenceGridOptions.columnDefs[0]);
            });
          }
          unwatch();
        });
      });

    };
  }

})();
