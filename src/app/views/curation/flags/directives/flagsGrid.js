(function() {
  'use strict';
  angular.module('civic.curation')
    .directive('flagsGrid', flagsGrid)
    .controller('FlagsGridController', FlagsGridController);

  // @ngInject
  function flagsGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'app/views/curation/flags/directives/flagsGrid.tpl.html',
      controller: 'FlagsGridController'
    };
    return directive;
  }

  // @ngInject
  function FlagsGridController($log,
                               $scope,
                               $filter,
                               $state,
                               $location,
                               uiGridConstants,
                               _,
                               Flags) {
    var ctrl = $scope.ctrl = {};
    console.log('flag grid loaded.');

    var maxRows = ctrl.maxRows = 20;

    ctrl.events = $scope.events;

    ctrl.totalItems = Number();
    ctrl.page = $scope.page || 1;
    ctrl.count= maxRows;

    ctrl.filters = [];
    ctrl.sorting = [];

    ctrl.isFiltered = ctrl.filters.length > 0;

    $scope.$watch('ctrl.totalItems', function() {
      ctrl.totalPages = Math.ceil(ctrl.totalItems / maxRows);
    });

    ctrl.gridOptions = {
      enablePaginationControls: false,

      useExternalFiltering: true,
      useExternalSorting: true,
      useExternalPaging: true,

      paginationPageSizes: [maxRows],
      paginationPageSize: maxRows,
      minRowsToShow: maxRows-1,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,

      enableFiltering: false,
      enableColumnMenus: false,
      // enableSorting: true,
      enableSorting: false,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      columnDefs: [
        { name: 'flagging_user',
          displayName: 'Flagging User',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          enableSorting: false,
          width: '15%',
          cellTemplate: '<div class="ui-grid-cell-contents"><user-block user="row.entity[col.field]"</div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'entity_type',
          displayName: 'Entity Type',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false,
          width: '15%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'entity_name',
          displayName: 'Entity Name',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false,
          width: '20%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'flagging_comment',
          displayName: 'Flagging Comment',
          enableFiltering: true,
          allowCellFocus: false,
          enableSorting: false,
          type: 'string',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'created_at',
          displayName: 'Flagged',
          type: 'date',
          sort: {direction: uiGridConstants.DESC},
          width: '15%',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: true,
          cellTemplate: '<div class="ui-grid-cell-contents"><span ng-bind="row.entity[col.field]|timeAgo"></span></div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'action',
          displayName: 'Actions',
          width: '15%',
          allowCellFocus: false,
          enableFiltering: false,
          cellTemplate:
            '<div class="ui-grid-cell-contents text-right">' +
            '<button ng-click="grid.appScope.ctrl.viewFlag(row)"' +
            'class="btn btn-xs btn-primary">' +
            'View Flagged Entity' +
            '</button>' +
            '</div>'
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
      ctrl.viewFlag = function(row){
        var event = row.entity;
        var subjectStates = {
          Gene: 'events.genes',
          Variant: 'events.genes.summary.variants',
          VariantGroup: 'events.genes.summary.variantGroups',
          EvidenceItem: 'events.genes.summary.variants.summary.evidence'
        };

        var stateParams = {};
        _.each(event.state_params, function(obj, entity) {
          var entityId;
          var hash;
          if(entity === 'evidence_item') {
            entityId = 'evidenceId';
            hash='evidence';
          } else if (entity === 'variant') {
            entityId = 'variantId';
            hash = 'variant';
          } else if (entity === 'variant_group') {
            entityId = 'variantGroupId';
            hash = 'variant-group';
          } else {
            entityId = entity + 'Id';
          }
          stateParams[entityId] = obj.id;
          stateParams['#'] = hash;
        });

        // temporarily check to check existence of unlinkable attribute, until implemented
        // TODO: remove check when unlinkable attr implemented
        if (_.isUndefined(event.unlinkable) === true || event.unlinkable === false) {
          $state.go(subjectStates[event.flaggable_type] + '.summary', stateParams);
        }
      };
    };

    $scope.$watchCollection(function() {
      return Flags.data.collection;
    }, function(flags) {
      ctrl.gridOptions.data = _.map(flags, function(flag) {
        // pull out comments
        flag.flagging_comment = flag.comments[0].text;
        if(!_.isUndefined(flag.comments[1])) {
          flag.resolving_comment = flag.comments[1].text;
        }
        // set up entity type, name
        var type = _.chain(flag.state_params).findKey({id: flag.flaggable_id}).value();
        flag.entity_type = $filter('keyToLabel')(type).toUpperCase();
        flag.entity_name = _.chain(flag.state_params).find({id: flag.flaggable_id}).value().name;
        return flag;
      });

    });

    function updateData() {
      fetchData(ctrl.count, ctrl.page, ctrl.sorting, ctrl.filters)
        .then(function(response) {
          if(_.isUndefined(response.total) && !_.isUndefined(response._meta)) {
            ctrl.totalItems = response._meta.total_count;
          } else if(!_.isUndefined(response.total)) {
            ctrl.totalItems = response.total;
          }
        });
    }

    function fetchData(count, page, sorting, filters) {
      var request;

      request= {
        count: count,
        page: page
      };
      if($scope.id) {
        request.id = $scope.id;
      }

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

      return Flags.queryOpen(request);
    }

    updateData();

  }

})();
