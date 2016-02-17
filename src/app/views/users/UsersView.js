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
        templateUrl: 'app/views/users/profile/profile.tpl.html',
        resolve: {
          'Users': 'Users',
          'user': function(Users, $stateParams) {
            return Users.get($stateParams.userId);
          },
          'events': function(Users, $stateParams) {
            return Users.queryEvents($stateParams.userId);
          },
          'evidence': function(Search, user) {
            var query = {
              'operator':'AND',
              'save': false,
              'queries': [
                {
                  'field':'submitter_id',
                  'condition': {
                    'name':'is_equal_to',
                    'parameters':[user.id]
                  }
                }
              ]};
            return Search.post(query);
          }
        },
        controller: 'ProfileController',
        data: {
          navMode: 'sub',
          titleExp: '"Profile: " + user.display_name'
        }
      })
      .state('users.edit', {
        url:'/edit',
        templateUrl: 'app/views/users/profile/edit/profileEdit.tpl.html',
        resolve: {
          'Users': 'Users',
          'user': function(Users, $stateParams) {
            return Users.get($stateParams.userId);
          }
        },
        controller: 'ProfileEditController',
        data: {
          navMode: 'sub',
          titleExp: '"Profile: " + user.display_name'
        }
      });
  }

  // @ngInject
  function UsersViewController() {
    console.log('UsersViewController instantiated.');
  }

})();
