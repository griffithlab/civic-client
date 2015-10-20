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
      },
      templateUrl: 'app/views/activity/directives/activityGrid.tpl.html',
      controller: 'ActivityGridController'
    };
    return directive;
  }

  // @ngInject
  function ActivityGridController($log,
                                  $scope,
                                  $state,
                                  uiGridConstants,
                                  _,
                                  Events) {
    var ctrl = $scope.ctrl = {};

    var pageCount = 25;
    var maxRows = ctrl.maxRows = pageCount;

    ctrl.events = $scope.events;

    ctrl.totalItems = Number();
    ctrl.page = $scope.page;
    ctrl.count= maxRows;

    ctrl.filters = [];
    ctrl.sorting = [];

    ctrl.isFiltered = ctrl.filters.length > 0;

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
      minRowsToShow: maxRows + 1,

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
          width: '15%',
          cellTemplate: '<div class="ui-grid-cell-contents"><user-block user="row.entity[col.field]"</div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'event_type',
          displayName: 'Event Type',
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
          width: '15%',
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
          width: '20%',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item',
          field: 'state_params.evidence_item.name',
          displayName: 'Item',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          width: '10%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'timestamp',
          field: 'timestamp',
          displayName: 'Timestamp',
          type: 'date',
          sort: {direction: uiGridConstants.ASC},
          allowCellFocus: false,
          enableFiltering: false,
          cellTemplate: '<div class="ui-grid-cell-contents"><span ng-bind="row.entity[col.field]|timeAgo"></span></div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }

      ]
    };
    ctrl.gridOptions.onRegisterApi = function(gridApi){
      ctrl.gridApi = gridApi;

      // called from pagination directive when page changes
      ctrl.pageChanged = function() {
        $log.info('page changed: ' + ctrl.page);
        $location.search('page', ctrl.page);
        updateData();
      };

      // reset paging and do some other stuff on filter changes
      gridApi.core.on.filterChanged($scope, function() {
        $log.info('filter changed.');
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
        $log.info('sort changed.');
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
      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        // $log.info(['geneID:', row.entity.id, 'variantId:', row.entity.variant_id].join(' '));
        $log.info(['geneId:', row.entity.gene_id, 'variantId:', row.entity.variant_id].join(' '));
        if(ctrl.mode === 'variants') {
          $state.go('events.genes.summary.variants.summary', {
            geneId: row.entity.gene_id,
            variantId: row.entity.variant_id
          });
        } else {
          $state.go('events.genes.summary', {
            geneId: row.entity.id
          });
        }
      });
    };

    function updateData() {
      fetchData(ctrl.count, ctrl.page, ctrl.sorting, ctrl.filters)
        .then(function(data){
          ctrl.gridOptions.data = data;
          ctrl.totalItems = data.length + 85;
        });
    }

    function fetchData(count, page, sorting, filters) {
      var request;

      request= {
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
      return Events.query(request);
    }

    updateData();

  }

})();
