(function() {
  'use strict';
  angular.module('civic.account')
    .controller('AccountViewController', AccountViewController)
    .controller('AccountNotificationsController', AccountNotificationsController)
    .controller('AccountProfileController', AccountProfileController)  ;

  // @ngInject
  function AccountViewController($scope) {

  }

  // @ngInject
  function AccountNotificationsController($scope, CurrentUser,  feed, _) {
    var vm = $scope.vm = {};
    vm.total = feed.total;

    vm.mentions = _.chain(feed.notifications.mentions)
      .map(function(mention) { mention.type = 'mention'; return mention;})
      .sortBy('created_at')
      .reverse()
      .value();

    vm.subscribed_events = _.chain(feed.notifications.subscribed_events)
      .map(function(event) {
        event.type = 'event';
        event.event.seen = event.seen;
        return event})
      .sortBy('created_at')
      .value();

    vm.notifications = _.chain(vm.mentions)
      .concat(vm.subscribed_events)
      .sortBy('created_at')
      .reverse()
      .value();

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead()
        .then(function(response) {
          console.log(response);
        })
    }
  }

  // @ngInject
  function AccountProfileController() {
    console.log('AccountProfileController called.');
  }

})();
