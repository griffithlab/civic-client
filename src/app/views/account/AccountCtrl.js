(function() {
  'use strict';
  angular.module('civic.account')
    .controller('AccountCtrl', AccountCtrl)
    .config(accountConfig);

// @ngInject
  function AccountCtrl($scope, $rootScope, $log) {
    $log.info('AccountCtrl loaded.');
    $rootScope.navMode = 'sub';
    $rootScope.viewTitle = 'Account';
    $scope.loadedMsg = 'Loaded Account!';
  }

// @ngInject
  function accountConfig($stateProvider, AuthorizationProvider) {
    $stateProvider
      .state('account', {
        url: '/account',
        controller: 'AccountCtrl',
        templateUrl: '/civic-client/views/account/account.tpl.html',
        resolve: {
          authorized: AuthorizationProvider.requireAuthenticatedUser
        }
      });
  }
})();