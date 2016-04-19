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
  function AccountNotificationsController($scope,
                                          $state,
                                          $stateParams,
                                          CurrentUser,
                                          Security,
                                          feed,
                                          _) {
    if(_.isUndefined($stateParams.category)) {
      $state.go('account.notifications', {category: 'all'})
    }
    var vm = $scope.vm = {};

    vm.notifications = [];

    vm.total = Number();

    $scope.$watch(function() { return CurrentUser.data.feed}, function(feed){
      vm.total = feed.length;

      vm.notifications = $stateParams.category == 'all'
        ? feed
        : _.filter(feed, {type: $stateParams.category.substring(0,$stateParams.category.length-1)});

      vm.categories = [
        {
          name: 'All',
          state: 'account.notifications({category:"all"})',
          count: feed.length
        },
        {
          name: 'Mentions',
          state: 'account.notifications({category:"mentions"})',
          count: _(feed).filter({type: 'mention'}).value().length
        },
        {
          name: 'Subscribed Events',
          state: 'account.notifications({category:"subscribed_events"})',
          count: _(feed).filter({type: 'subscribed_event'}).value().length
        }
      ];
    });

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead().then(function() {
        Security.reloadCurrentUser(); // to update notification counts
      });
    }
  }

  // @ngInject
  function AccountProfileController() {
    console.log('AccountProfileController called.');
  }

})();
