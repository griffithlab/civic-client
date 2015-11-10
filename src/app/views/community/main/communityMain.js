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

    vm.filters = [];
    vm.count = 20;
    vm.sorting = [{
      field: 'display_name',
      direction: 'asc'
    }];

    Community.getLeaderboards()
      .then(function(response) {
        angular.copy(response, vm.leaderboards);
      });

    fetchUsers(10,1,vm.sorting,vm.filters)
      .then(function(response) {
        angular.copy(response.result, vm.users);
      });

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
