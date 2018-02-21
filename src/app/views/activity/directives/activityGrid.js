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
        entity: '=', // site, user, organization
        id: '='
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
                                  $location,
                                  uiGridConstants,
                                  _,
                                  Events) {
    var ctrl = $scope.ctrl = {};

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
          enableSorting: false,
          width: '15%',
          cellTemplate: '<div class="ui-grid-cell-contents"><user-block user="row.entity[col.field]"</div>',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'role',
          field: 'user.role',
          displayName: 'Role',
          enableFiltering: true,
          allowCellFocus: false,
          enableSorting: false,
          type: 'string',
          width: '8%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'event_type',
          displayName: 'Event Type',
          enableFiltering: true,
          allowCellFocus: false,
          enableSorting: false,
          type: 'string',
          width: '20%',
          cellTemplate: '<div class="ui-grid-cell-contents">' +
          '{{row.entity[col.field]}}' +
          '<span ng-if="row.entity.unlinkable === true" style="color: #999;" class="small"> (unlinkable)</span>' +
          '</div>',
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
          enableFiltering: false,
          enableSorting: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant',
          field: 'state_params.variant.name',
          displayName: 'Variant',
          type: 'string',
          width: '15%',
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: false,
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
          enableFiltering: false,
          enableSorting: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'timestamp',
          field: 'timestamp',
          displayName: 'Timestamp',
          type: 'date',
          sort: {direction: uiGridConstants.DESC},
          allowCellFocus: false,
          enableFiltering: false,
          enableSorting: true,
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
        var event = row.entity;
        var subjectStates = {
          assertions: 'events.assertions',
          genes: 'events.genes',
          variants: 'events.genes.summary.variants',
          variantgroups: 'events.genes.summary.variantGroups',
          evidenceitems: 'events.genes.summary.variants.summary.evidence',
          sources: 'sources'
        };

        // revision comments require some more logic to determine the proper state
        if(event.subject_type === 'suggestedchanges') {
          var state;
          var type = event.state_params.suggested_change.subject_type;
          if(type === 'evidenceitems') {
            state = 'events.genes.summary.variants.summary.evidence';
          } else if (type === 'variantgroups') {
            state = 'events.genes.summary.variantGroups';
          } else if (type === 'variants') {
            state = 'events.genes.summary.variants';
          } else if (type === 'genes') {
            state = 'events.genes';
          }
          subjectStates.suggestedchanges = state;
        }


        var stateExtension = {
          'commented': '.talk.comments',
          'submitted': '.summary',
          'accepted': '.summary',
          'assertion submitted': '.summary',
          'assertion accepted': '.summary',
          'assertion rejected': '.summary',
          'rejected': '.summary',
          'flagged': '.summary',
          'flag resolved': '.summary',
          'publication suggested': '.summary',
          'change suggested': '.talk.revisions.list.summary',
          'change accepted': '.talk.revisions.list.summary',
          'change rejected': '.talk.revisions.list.summary'
        };

        // revision comments are shown in their revision's summary view, override commented extension
        if(event.subject_type === 'suggestedchanges') {
          stateExtension.commented = '.talk.revisions.list.summary';
        }

        // sources display comments right on their summary page
        if(event.subject_type === 'sources') {
          stateExtension.commented = '.summary';
        }

        var stateParams = {};
        _.each(event.state_params, function(obj, entity) {
          var entityId;
          if(entity === 'suggested_change') {
            entityId = 'revisionId';
          } else if (entity === 'evidence_item') {
            entityId = 'evidenceId';
          } else if (entity === 'variant_group') {
            entityId = 'variantGroupId';
          } else if (entity === 'source') {
            entityId = 'sourceId';
          } else {
            entityId = entity + 'Id';
          }
          stateParams[entityId] = obj.id;
        });

        if (event.unlinkable === false) {
          $state.go(subjectStates[event.subject_type] + stateExtension[event.event_type], stateParams);
        }
      });
    };
    $scope.$watchCollection(function() {
      return Events.data.collection;
    }, function(events) {
      ctrl.gridOptions.data = events;

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
      var entity = $scope.entity;
      var queryFunc;

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

      if(entity === 'site') {
        queryFunc = Events.query;
      } else if (entity === 'user') {
        queryFunc = Events.queryUserEvents;
      } else if(entity === 'organization') {
        queryFunc = Events.queryOrganizationEvents;
      } else {
        queryFunc = Events.query;
      }

      return queryFunc(request);
    }

    updateData();

  }

})();
