(function() {
  'use strict';
  angular.module('civic.users.profile', []);
  angular.module('civic.users.common', []);
  angular.module('civic.users')
    .config(UsersViewConfig)
    .controller('UsersViewController', UsersViewController);

  // @ngInject
  function UsersViewConfig($stateProvider) {
    console.log('UsersViewConfig called.');
    $stateProvider
      .state('users', {
        abstract: true,
        url: '/users/:userId',
        template: '<ui-view id="users-view"></ui-view>',
        controller: 'UsersViewController'
      })
      .state('users.profile', {
        url:'/profile',
        templateUrl: '/app/views/users/profile/profile.tpl.html',
        //resolve: {
        //  'test': function() {
        //    console.log('profile test resolve called.');
        //  }
        //},
        controller: 'ProfileController',
        data: {
          navMode: 'sub',
          titleExp: '"User: " + user.username'
        }
      });
  }

  // @ngInject
  function UsersViewController() {
    console.log('UsersViewController instantiated.');
  }

})();
