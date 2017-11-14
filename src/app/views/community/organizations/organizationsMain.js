(function () {
  'use strict';
  angular.module('civic.add')
    .config(OrganizationsMainConfig)
    .controller('OrganizationsMainController', OrganizationsMainController);

  // @ngInject
  function OrganizationsMainConfig($stateProvider,
                               $resourceProvider) {
    // TODO: toggle trailing-slash trim after civic-server configured to accept either
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $stateProvider
      .state('community.organizations', {
        url: '/organizations',
        templateUrl: 'app/views/community/organizations/organizationsMain.tpl.html',
        resolve: {
          Users: 'Users',
          Community: 'Community'
        },
        controller: 'OrganizationsMainController',
        controllerAs: 'vm',
        data: {
          navMode: 'sub',
          title: 'Community'
        }
      });

  }

  // @ngInject
  function OrganizationsMainController($scope,
                                   _,
                                   Security,
                                   Community) {
    var vm = this;

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();
    vm.leaderboards = {};
    vm.users = [];

    Community.getLeaderboards()
      .then(function(response) {
        angular.copy(response, vm.leaderboards);
      });

  }

})();
