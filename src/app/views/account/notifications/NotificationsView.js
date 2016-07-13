(function() {
  'use strict';
  angular.module('civic.account')
    .config(NotificationsView);

  // @ngInject
  function NotificationsView($stateProvider) {
    $stateProvider
      .state('account.notifications', {
        url: '/notifications?category?page?count?show_unlinkable?show_read&filter[name]&filter[limit]',
        templateUrl: 'app/views/account/notifications/notifications.tpl.html',
        data: {
          titleExp: '"Account Notifications"',
          navMode: 'sub'
        },
        //reloadOnSearch: false,
        controller: 'AccountNotificationsController'
      });
  }
})();
