(function() {
  'use strict';
  angular.module('civic.activity')
    .directive('activityGrid', activityGrid)
    .controller('ActivityGridController', ActivityGridController);

  // @ngInject
  function activityGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        events: '='
      },
      templateUrl: 'app/views/activity/directives/activityGrid.tpl.html',
      controller: 'ActivityGridController'
    };
    return directive;
  }

  // @ngInject
  function ActivityGridController($scope, $stateParams, $state, uiGridConstants, _) {
    var ctrl = $scope.ctrl = {};

    ctrl.events = $scope.events;

    ctrl.gridOptions = {
      enablePaginationControls: false,
      minRowsToShow: 10,

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
        { name: 'user',
          displayName: 'User',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          width: '20%',
          cellTemplate: '<div class="ui-grid-cell-contents"><user-block user="row.entity[col.field]"</div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'event_type',
          displayName: 'Event TYpe',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '20%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'gene',
          field: 'state_params.gene.name',
          displayName: 'Gene',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant',
          field: 'state_params.variant.name',
          displayName: 'Variant',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item',
          field: 'state_params.evidence_item.name',
          displayName: 'Evidence Item',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ]
    };
    ctrl.gridOptions.onRegisterApi = function(gridApi){
      ctrl.gridApi = gridApi;
      $scope.$watchCollection('events', function(events) {
        ctrl.gridOptions.data = events;
      });
    };

  }

})();
