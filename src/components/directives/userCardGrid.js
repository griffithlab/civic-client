(function() {
  'use strict';

  angular.module('civic.common')
    .directive('userCardGrid', userCardGridDirective)
    .controller('UserCardGridController', UserCardGridController);

  // @ngInject
  function userCardGridDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        options: '='
      },
      controller: 'UserCardGridController as vm',
      bindToController: true,
      templateUrl: 'components/directives/userCardGrid.tpl.html'
    };
  }

  // @inject
  function UserCardGridController($scope, _, Users) {
    var vm = this;
    vm.users = [];

    // setup initial paging var and data update
    vm.page = 1;
    vm.count = 24;
    vm.totalItems = Number();
    vm.totalPages = Number();

    $scope.$watch(function(){ return vm.totalItems; }, function() {
      vm.totalPages = Math.ceil(vm.totalItems / vm.count);
    });

    vm.model = {};

    var updateData = _.debounce(function () {
      var filters = [{
        field: 'display_name',
        term: vm.model.filter
      }];

      var sorting = [{
        field: vm.model.sort_by,
        direction: vm.model.sort_order
      }];

      var limit = vm.model.limit;

      fetchUsers(vm.count, vm.page, sorting, filters, limit, vm.model.role, vm.model.area_of_expertise)
        .then(function(data){
          angular.copy(data.result, vm.users);
          vm.totalItems = data.total;
        });
    }, 250);

    var fieldClassName = 'col-xs-6 col-sm-4 col-md-2';

    vm.formFields = [
      {
        key: 'filter',
        type: 'input',
        className: fieldClassName,
        templateOptions: {
          label: 'Find User',
          required: false
        },
        watcher: {
          listener: function() {
            updateData();
          }
        }
      },
      {
        key: 'role',
        type: 'select',
        className: fieldClassName,
        defaultValue: undefined,
        templateOptions: {
          label: 'Role',
          required: false,
          options: [
            { value: undefined, name: '--' },
            { value: 'curator', name: 'Curator'},
            { value: 'editor', name: 'Editor' },
            { value: 'admin', name: 'Administrator' }
          ]
        },
        watcher: {
          listener: function() {
            updateData();
          }
        }
      },
      {
        key: 'area_of_expertise',
        type: 'select',
        className: fieldClassName,
        defaultValue: undefined,
        templateOptions: {
          label: 'Area of Expertise',
          required: false,
          options: [
            { value: undefined, name: '--' },
            { value: 'Patient Advocate', name: 'Patient Advocate'},
            { value: 'Clinical Scientist', name: 'Clinical Scientist' },
            { value: 'Research Scientist', name: 'Research Scientist' }
          ]
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
            {name: 'Last seen', value: 'last_seen', sort_order: 'desc'},
            {name: 'Recent activity', value: 'recent_activity', sort_order: 'desc'},
            {name: 'Join date', value: 'join_date', sort_order: 'asc'},
            {name: 'Most active', value: 'most_active', sort_order: 'desc'}
          ]
        },
        watcher: {
          listener: function(field, newValue) {
            if(!_.isUndefined(newValue)) {
              vm.model.sort_order = _.find(field.templateOptions.options, {value: newValue}).sort_order;
            }
            updateData();
          }
        }
      },
      {
        key: 'sort_order',
        type: 'select',
        className: fieldClassName,
        defaultValue: 'desc',
        templateOptions: {
          label: 'Sort Order',
          required: false,
          options: [
            { name: 'Ascending', value: 'asc' },
            { name: 'Descending', value: 'desc' }
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
        className: fieldClassName,
        defaultValue: 'this_month',
        templateOptions: {
          label: 'Limit To',
          required: false,
          options: [
            // this_week, this_month, this_year, all_time
            {name: 'All time', value: 'all_time'},
            {name: 'This week', value: 'this_week'},
            {name: 'This month', value: 'this_month'},
            {name: 'This year', value: 'this_year'}
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

    function fetchUsers(count, page, sorting, filters, limit, role, area_of_expertise) {
      var request;

      request = {
        count: count,
        page: page
      };

      if(role) {
        request['filter[role]'] = role;
      }
      if(area_of_expertise) {
        request['filter[area_of_expertise]'] = area_of_expertise;
      }

      request['limit[' + sorting[0].field + ']'] = limit;

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
      return Users.query(request);
    }
  }
})();
