(function() {
  'use strict';
  angular.module('civic.activity')
    .controller('ActivityController', ActivityController);

  // @ngInject
  function ActivityController($scope, $log, uiGridConstants, Events) {
    var ctrl = $scope.ctrl = {};

    ctrl.events = [];

    Events.query()
      .then(function(events) {
        ctrl.events = events;
      });

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
        { name: 'user.displayname',
          displayName: 'User',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          width: '10%',
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
          name: 'state_params.gene.name',
          displayName: 'Description',
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
      $scope.$watchCollection(function(){ return ctrl.events;}, function(events) {
        ctrl.gridOptions.data = events;
      });
    };
  }
})();
