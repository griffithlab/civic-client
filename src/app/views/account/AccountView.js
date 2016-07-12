(function() {
  'use strict';
  angular.module('civic.account')
    .config(AccountView);

  // @ngInject
  function AccountView($stateProvider) {
    $stateProvider
      .state('account', {
        abstract: true,
        url: '/account',
        templateUrl: 'app/views/account/account.tpl.html',
        data: {
          titleExp: '"My Account"',
          navMode: 'sub'
        }
      });
  }

})();
