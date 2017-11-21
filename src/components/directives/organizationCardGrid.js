(function() {
  'use strict';

  angular.module('civic.common')
    .directive('organizationCardGrid', organizationCardGridDirective)
    .controller('OrganizationCardGridController', OrganizationCardGridController);

  // @ngInject
  function organizationCardGridDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        options: '='
      },
      controller: 'OrganizationCardGridController as vm',
      bindToController: true,
      templateUrl: 'components/directives/organizationCardGrid.tpl.html'
    };
  }

  // @inject
  function OrganizationCardGridController($scope, _, Organizations) {
    var vm = this;
    vm.organizations = [];

    // setup initial paging var and data update
    vm.page = 1;
    vm.count = 24;
    vm.totalItems = Number();
    vm.totalPages = Number();

    $scope.$watch(function() {
      return vm.totalItems;
    }, function() {
      vm.totalPages = Math.ceil(vm.totalItems / vm.count);
    });

    vm.model = {};

    var updateData = _.debounce(function() {
      var filters = [{
        field: 'name',
        term: vm.model.name
      }];

      var sorting = [{
        field: vm.model.sort_by,
        direction: vm.model.sort_order
      }];

      var limit = vm.model.limit;

      fetchOrganizations(vm.count, vm.page, sorting, filters, limit, vm.model.name)
        .then(function(data) {
          angular.copy(parseOrgs(data.records), vm.organizations);
          vm.totalItems = data.total;
        });
    }, 250);

    function parseOrgs(orgs) {
      return _.map(orgs, function(org) {
        org.community_params = {
          action_count: 99999,
          most_recent_action_timestamp: '2015-12-22T20:19:13.541Z',
          members: 99999
        };
        return org;
      });
    }

    var fieldClassName = 'col-xs-6 col-sm-4';
    var fieldClassNameShort = 'col-xs-3 col-sm-2';

    vm.formFields = [{
        key: 'name',
        type: 'input',
        className: fieldClassName,
        templateOptions: {
          label: 'Filter Name',
          required: false
        },
        watcher: {
          listener: function() {
            updateData();
          }
        }
      },
      {
        key: 'sort_by',
        type: 'select',
        className: fieldClassName,
        defaultValue: 'most_active',
        templateOptions: {
          label: 'Sort By',
          required: false,
          options: [
            // last_seen, recent_activity, join_date, most_active
            {
              name: 'Last seen',
              value: 'last_seen',
              sort_order: 'desc'
            },
            {
              name: 'Recent activity',
              value: 'recent_activity',
              sort_order: 'desc'
            },
            {
              name: 'Join date',
              value: 'join_date',
              sort_order: 'asc'
            },
            {
              name: 'Most active',
              value: 'most_active',
              sort_order: 'desc'
            }
          ]
        },
        watcher: {
          listener: function(field, newValue) {
            if (!_.isUndefined(newValue)) {
              vm.model.sort_order = _.find(field.templateOptions.options, {
                value: newValue
              }).sort_order;
            }
            updateData();
          }
        }
      },
      {
        key: 'sort_order',
        type: 'select',
        className: fieldClassNameShort,
        defaultValue: 'desc',
        templateOptions: {
          label: 'Sort',
          required: false,
          options: [{
              name: 'Asc',
              value: 'asc'
            },
            {
              name: 'Desc',
              value: 'desc'
            }
          ]
        },
        watcher: {
          listener: function() {
            updateData();
          }
        }
      },
      {
        key: 'limit',
        type: 'select',
        className: fieldClassNameShort,
        defaultValue: 'this_month',
        templateOptions: {
          label: 'Limit To',
          required: false,
          options: [
            // this_week, this_month, this_year, all_time
            {
              name: 'All',
              value: 'all_time'
            },
            {
              name: 'Week',
              value: 'this_week'
            },
            {
              name: 'Month',
              value: 'this_month'
            },
            {
              name: 'Year',
              value: 'this_year'
            }
          ]
        },
        watcher: {
          listener: function() {
            updateData();
          }
        }
      },
    ];

    updateData();

    vm.pageChanged = function() {
      updateData();
    };

    function fetchOrganizations(count, page, sorting, filters, limit, name) {
      var request;

      request = {
        count: count,
        page: page
      };

      request['limit[' + sorting[0].field + ']'] = limit;

      if (filters.length > 0) {
        _.each(filters, function(filter) {
          if (!_.isUndefined(filter.term)) {
            request['filter[' + filter.field + ']'] = filter.term;
          }
        });
      }

      if (sorting.length > 0) {
        _.each(sorting, function(sort) {
          request['sorting[' + sort.field + ']'] = sort.direction;
        });
      }
      return Organizations.query(request);
    }
  }
})();
