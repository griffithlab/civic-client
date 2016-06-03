(function() {
  'use strict';
  angular.module('civic.account')
    .controller('AccountNotificationsController', AccountNotificationsController);

  // @ngInject
  function AccountNotificationsController($scope,
                                          $state,
                                          $stateParams,
                                          $location,
                                          CurrentUser,
                                          Security,
                                          feed,
                                          _) {

    if(_.isUndefined($stateParams.category)) {
      $state.go('account.notifications', { category: 'all' })
    }
    var vm = $scope.vm = {};
    vm.count = feed._meta.per_page;
    vm.page = feed._meta.current_page;
    vm.totalItems = feed._meta.total_count;
    vm.totalPages = feed._meta.total_pages;

    vm.countOptions= [10,25,50,100];
    vm.notifications = [];

    vm.pageChanged = function() {
      $location.search({page: vm.page, count: vm.count, category: vm.category});
      fetch();
    };

    var fetch = function() {
      CurrentUser.getFeed({count: vm.count, page: vm.page})
    };

    $scope.$watch(function() { return CurrentUser.data.feed}, function(feed){
      vm.count = feed._meta.per_page;
      vm.page = feed._meta.current_page;
      vm.totalItems = feed._meta.total_count;
      vm.totalPages = feed._meta.total_pages;

      vm.totalUnseenNotifications = _.filter(feed.records, function(n) {
        return n.seen === false;
      }).length;

      if($stateParams.category == 'all') {
        angular.copy(feed.records, vm.notifications);
      } else {
        angular.copy(
          _.filter(feed.records, {type: $stateParams.category.substring(0,$stateParams.category.length-1)}),
          vm.notifications);
      }

      vm.categories = [
        {
          name: 'All',
          state: 'account.notifications({category:"all"})',
          count: feed.records.length
        },
        {
          name: 'Mentions',
          state: 'account.notifications({category:"mentions"})',
          count: _(feed.records).filter({type: 'mention'}).value().length
        },
        {
          name: 'Subscribed Events',
          state: 'account.notifications({category:"subscribed_events"})',
          count: _(feed.records).filter({type: 'subscribed_event'}).value().length
        }
      ];
    }, true);

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead().then(function() {
        Security.reloadCurrentUser(); // to update notification counts
      });
    }
  }
})();
