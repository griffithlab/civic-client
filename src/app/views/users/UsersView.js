(function() {
  'use strict';
  angular.module('civic.users.profile', []);
  angular.module('civic.users.common', []);
  angular.module('civic.users')
    .config(UsersViewConfig)
    .controller('UsersViewController', UsersViewController);

  // @ngInject
  function UsersViewConfig($stateProvider) {
    $stateProvider
      .state('users', {
        abstract: true,
        url: '/users/:userId',
        template: '<ui-view id="users-view"></ui-view>',
        controller: 'UsersViewController',
        resolve: {
          Users: 'Users',
          initUser: function(Users, $stateParams) {
            return Users.initBase($stateParams.userId);
          }
        }
      })
    .state('users.profile', {
        url:'/profile',
        template: '<user-profile></user-profile>'
      });

  }

  // @ngInject
  function UsersViewController() {
    console.log('UsersViewController instantiated.');
  }

})();
