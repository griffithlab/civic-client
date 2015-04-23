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
        revisionItems: '='
      },
      templateUrl: 'app/views/events/common/revisionsGrid.tpl.html',
      controller: 'RevisionsGridController'
    };
    return directive;
  }

  // @ngInject
  function RevisionsGridController($scope, $stateParams, $state, uiGridConstants, _) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};

    ctrl.revisionsGridOptions = {
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
      columnDefs: [
        { name: 'id',
          displayName: 'ID',
          enableFiltering: false,
          allowCellFocus: false,
          width: '5%'
        },
        { name: 'type',
          displayName: 'Type',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'user',
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
          }
        }
      ]
    };

    ctrl.revisionsGridOptions.onRegisterApi = function(gridApi){
      ctrl.gridApi = gridApi;
      ctrl.revisionsGridOptions.data = $scope.revisionItems;
    };
  }

})();
