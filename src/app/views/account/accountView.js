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
        controller: 'AccountViewController',
        templateUrl: 'app/views/account/account.tpl.html',
        data: {
          titleExp: '"My Account"',
          navMode: 'sub'
        }
      })
      .state('account.main', {
        url: '/main',
        templateUrl: 'app/views/account/main.tpl.html',
        data: {
          titleExp: '"My Account"',
          navMode: 'sub'
        },
        resolve: {
          mentions: /* @ngInject */ function(CurrentUser) {
            CurrentUser.getMentions().then(function(response) {
              return response;
            });
          }
        }
      })
      .state('account.mentions', {
        url: '/mentions',
        templateUrl: 'app/views/account/mentions.tpl.html',
        data: {
          titleExp: '"My Mentions"',
          navMode: 'sub'
        },
        resolve: {
          mentions: /* @ngInject */ function(CurrentUser) {
            CurrentUser.getMentions().then(function(response) {
              return response;
            });
          }
        }
      });
  }

})();
