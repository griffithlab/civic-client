(function() {
  'use strict';
  angular.module('civic.events')
    .directive('revisionsGrid', revisionsGrid)
    .controller('RevisionsGridController', RevisionsGridController);

  // @ngInject
  function revisionsGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        changes: '=',
        baseState: '@'
      },
      templateUrl: 'app/views/events/common/revisionsGrid.tpl.html',
      controller: 'RevisionsGridController'
    };
    return directive;
  }

  // @ngInject
  function RevisionsGridController($scope, $state, $stateParams, $location, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};
    $scope.$state = $state;
    $scope.$stateParams = $stateParams;

    ctrl.rowsToShow = 6;

    ctrl.revisionsGridOptions = {
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
          displayName: 'RID',
          enableFiltering: false,
          allowCellFocus: false,
          width: '5%'
        },
        { name: 'user',
          displayName: 'Submitted by',
          enableFiltering: true,
          allowCellFocus: false,
          cellFilter: 'user.display_name',
          cellTemplate: '<div class="ui-grid-cell-contents"><user-block user="row.entity[col.field]"</div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'status',
          displayName: 'Status',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'created_at',
          displayName: 'Created',
          allowCellFocus: false,
          enableFiltering: false,
          sort: { direction: uiGridConstants.DESC },
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/events/common/revisionsGridCreatedCell.tpl.html'
        }
      ]
    };

    // wait until grid instantiated, then assign data and row-click listener
    ctrl.revisionsGridOptions.onRegisterApi = function(gridApi){
      // make grid API available on scope and set grid data
      ctrl.gridApi = gridApi;
      ctrl.revisionsGridOptions.data = $scope.changes;

      //if we're loading a revision, highlight the correct row in the table
      if(_.has($stateParams, 'revisionId')) {
        var rowEntity = _.find($scope.changes, function(item) {
          return item.id === +$stateParams.revisionId;
        });

        gridApi.core.on.rowsRendered($scope, function() {
          gridApi.selection.selectRow(rowEntity);
          gridApi.grid.scrollTo(rowEntity);
        });
      }

      // navigate to revision summary state when row clicked
      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        var params = _.merge($scope.$stateParams, { revisionId: row.entity.id });
        var newState = $scope.baseState + '.list.summary';
        $state.go(newState, params);
      });

      // watch for any revisions updates
      $scope.$watchCollection('changes', function(changes) {
        ctrl.revisionsGridOptions.data = changes;
      });

    };
  }

})();
