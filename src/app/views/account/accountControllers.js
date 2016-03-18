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
  function AccountNotificationsController($scope, $location, CurrentUser, feed, page, _) {
    var vm = $scope.vm = {};
    vm.total = feed.total;

    vm.itemsPerPage = 25;

    vm.notifications = [];

    vm.totalItems = feed.total;
    vm.page = page;
    vm.count = Number();

    $scope.$watch('vm.total', function() {
      vm.totalPages = Math.ceil(vm.total / vm.itemsPerPage);
    });

    $scope.$watch(function() { return CurrentUser.data.feed; }, function(feed) {
      console.log('feed updated.');
      console.log(feed);
      angular.copy(CurrentUser.data.feed, vm.notifications);
    }, true);

    vm.pageChanged = function() {
      $location.search('page', vm.page);
      CurrentUser.getFeed({page: vm.page })
        .then(function() {
          angular.copy(CurrentUser.data.feed, vm.notifications);
        })
    };

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead();
    }
  }

  // @ngInject
  function AccountProfileController() {
    console.log('AccountProfileController called.');
  }

})();
