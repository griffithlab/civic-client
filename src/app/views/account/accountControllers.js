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

    vm.notifications = [];

    $scope.$watch(function() { return CurrentUser.data.feed; }, function(feed) {
      console.log('feed updated.');
      console.log(feed);
      angular.copy(CurrentUser.data.feed, vm.notifications);
    }, true);

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead();
    }
  }

  // @ngInject
  function AccountProfileController() {
    console.log('AccountProfileController called.');
  }

})();
