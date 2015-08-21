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

    ctrl.rowsToShow = 3;

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
        { name: 'user.username',
          displayName: 'Submitted by',
          enableFiltering: true,
          allowCellFocus: false,
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
          enableFiltering: true,
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
      ctrl.gridApi = gridApi;
      ctrl.revisionsGridOptions.data = $scope.changes;

      $scope.$watchCollection('changes', function(changes) {
        ctrl.revisionsGridOptions.data = changes;

        // if we're loading a revision, highlight the correct row in the table
        //if(_.has($stateParams, 'revisionId')) {
        //  var rowEntity = _.find(changes, function(item) {
        //    return item.id === +$stateParams.revisionId;
        //  });
        //
        //  gridApi.core.on.rowsRendered($scope, function() {
        //    gridApi.selection.selectRow(rowEntity);
        //    gridApi.grid.scrollTo(rowEntity);
        //  });
        //}

        gridApi.selection.on.rowSelectionChanged($scope, function(row){
          var params = _.merge($scope.$stateParams, { revisionId: row.entity.id });
          var newState = $scope.baseState + '.list.summary';
          $scope.$state.go(newState, params);
        });
      });
    };
  }

})();
