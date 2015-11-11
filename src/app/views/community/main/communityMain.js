(function () {
  'use strict';
  angular.module('civic.add')
    .config(CommunityMainConfig)
    .controller('CommunityMainController', CommunityMainController);

  // @ngInject
  function CommunityMainConfig($stateProvider, $resourceProvider) {
    // TODO: toggle trailing-slash trim after civic-server configured to accept either
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $stateProvider
      .state('community.main', {
        url: '/main',
        templateUrl: 'app/views/community/main/CommunityMain.tpl.html',
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
                                   $stateParams,
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

    vm.model = {
      sort_by: 'display_name',
      limit: 'all_time',
      filter: ''
    };

    vm.filterFields = [
      {
        key: 'filter',
        type: 'input',
        templateOptions: {
          label: 'Find User',
          required: false
        },
        watcher: {
          listener: function(field, newValue, oldValue, scope, stopWatching) {
            updateData();
          }
        }
      }
    ];
    vm.limitFields = [
      {
        key: 'limit',
        type: 'select',
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
          listener: function(field, newValue, oldValue, scope, stopWatching) {
            updateData();
          }
        }
      }
    ];

    vm.sortFields = [
      {
        key: 'sort_by',
        type: 'select',
        templateOptions: {
          label: 'Sort By',
          required: false,
          options: [
            // last_seen, recent_activity, join_date, most_active
            {name: 'Display name', value: 'display_name'},
            {name: 'Last seen', value: 'last_seen'},
            {name: 'Recent activity', value: 'recent_activity'},
            {name: 'Join date', value: 'join_date'},
            {name: 'Most active', value: 'most_active'}
          ]
        },
        watcher: {
          listener: function(field, newValue, oldValue, scope, stopWatching) {
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
        direction: 'asc'
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
          request['sorting[' + sort.field + ']'] = 'asc';
        });
      }
      return Users.query(request);
    }
  }

})();
