(function() {
  'use strict';
  angular.module('civic.account')
    .config(NotificationsView);

  // @ngInject
  function NotificationsView($stateProvider) {
    $stateProvider
      .state('account.notifications', {
        url: '/notifications?category?page?count',
        templateUrl: 'app/views/account/notifications/notifications.tpl.html',
        data: {
          titleExp: '"Account Notifications"',
          navMode: 'sub'
        },
        //reloadOnSearch: false,
        resolve: {
          feed: /* @ngInject */ function($stateParams, CurrentUser) {
            //return CurrentUser.getFeed({page: $stateParams.page});
            $stateParams.page = _.isUndefined($stateParams.page) ? 1 : $stateParams.page;
            $stateParams.count = _.isUndefined($stateParams.count) ? 10 : $stateParams.count;
            $stateParams.category = _.isUndefined($stateParams.category) ? 'all' : $stateParams.category;
            $stateParams.show_unlinkable = false;
            $stateParams.show_read = false;
            return CurrentUser.getFeed($stateParams);
          }
        },
        controller: 'AccountNotificationsController'
      });
  }
})();
