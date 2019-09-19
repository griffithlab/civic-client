(function() {
  'use strict';
  angular.module('civic.account')
    .config(AccountView);

  // @ngInject
  function AccountView($stateProvider) {
    $stateProvider
      .state('account.profile', {
        url: '/profile',
        templateUrl: 'app/views/account/profile/profile.tpl.html',
        data: {
          titleExp: '"Account Profile"',
          navMode: 'sub'
        },
        resolve: {
          'CurrentUser': 'CurrentUser',
          'user': function (CurrentUser) {
            return CurrentUser.get();
          },
          'statements': function(CurrentUser) {
            return CurrentUser.getCoiStatements();
          }
        },
        controller: 'AccountProfileController'
      });
  }

})();
