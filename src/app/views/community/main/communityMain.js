(function () {
  'use strict';
  angular.module('civic.add')
    .config(CommunityMainConfig)
    .controller('CommunityMainController', CommunityMainController);

  // @ngInject
  function CommunityMainConfig($stateProvider,
                               $resourceProvider,
                               formlyConfigProvider) {
    // TODO: toggle trailing-slash trim after civic-server configured to accept either
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $stateProvider
      .state('community.main', {
        url: '/main',
        templateUrl: 'app/views/community/main/communityMain.tpl.html',
        resolve: {
          Users: 'Users',
          Community: 'Community'
        },
        controller: 'CommunityMainController',
        controllerAs: 'vm',
        data: {
          navMode: 'sub',
          title: 'Community'
        }
      });

  }

  // @ngInject
  function CommunityMainController($scope,
                                   _,
                                   Security,
                                   Community,
                                   Users) {
    var vm = this;

    vm.isEditor = Security.isEditor();
    vm.isAuthenticated = Security.isAuthenticated();
    vm.leaderboards = {};
    vm.users = [];

    Community.getLeaderboards()
      .then(function(response) {
        angular.copy(response, vm.leaderboards);
      });

    // setup initial paging var and data update
    vm.page = 1;
    vm.count = 24;
    vm.totalItems = Number();
    vm.totalPages = Number();

    $scope.$watch(function(){ return vm.totalItems; }, function() {
      vm.totalPages = Math.ceil(vm.totalItems / vm.count);
    });

    vm.model = {};

    vm.formFields = [
      {
        key: 'filter',
        type: 'input',
        className: 'col-xs-3',
        templateOptions: {
          label: 'Find User',
          colSpan: 3,
          required: false,
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
        className: 'col-xs-3',
        defaultValue: 'all_time',
        templateOptions: {
          label: 'Limit To',
          colSpan: 3,
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
      {
        key: 'sort_by',
        type: 'select',
        className: 'col-xs-3',
        defaultValue: 'last_seen',
        templateOptions: {
          label: 'Sort By',
          colSpan: 3,
          required: false,
          options: [
            // last_seen, recent_activity, join_date, most_active
            {name: 'Last seen', value: 'last_seen', sort_order: 'desc'},
            {name: 'Recent activity', value: 'recent_activity', sort_order: 'desc'},
            {name: 'Join date', value: 'join_date', sort_order: 'desc'},
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
        className: 'col-xs-3',
        defaultValue: 'desc',
        templateOptions: {
          label: 'Sort Order',
          colSpan: 3,
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
      }
    ];

    updateData();

    vm.pageChanged = function() {
      updateData();
    };

    function updateData() {
      var filters = [{
        field: 'display_name',
        term: vm.model.filter
      }];

      var sorting = [{
        field: vm.model.sort_by,
        direction: vm.model.sort_order
      }];
      fetchUsers(vm.count, vm.page, sorting, filters)
        .then(function(data){
          angular.copy(data.result, vm.users);
          vm.totalItems = data.total;
        });
    }

    function fetchUsers(count, page, sorting, filters) {
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
      return Users.query(request);
    }
  }

})();
