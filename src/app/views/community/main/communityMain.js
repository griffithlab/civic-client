(function() {
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
    Community.getLeaderboards()
      .then(function(response) {
        angular.copy(leaderboards, response);
      });

  }

})();
