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

    vm.countOptions= [10,25,50,100];
    vm.notifications = [];

    vm.pageChanged = function() {
      $location.search({page: vm.page, count: vm.count, category: vm.category});
      fetch();
    };

    var fetch = function() {
      var request = {
        count: vm.count,
        page: vm.page
      };

      if(!_.isEmpty(vm.filters.name)) {
        request['filter[name]'] = vm.filters.name;
      }
      if(!_.isEmpty(vm.filters.limit)) {
        request['filter[limit]'] = vm.filters.limit;
      }

      CurrentUser.getFeed(request)
    };

    vm.filterFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Find User',
          required: false
        },
        watcher: {
          listener: function() {
            fetch();
          }
        }
      },
      {
        key: 'limit',
        type: 'select',
        defaultValue: 'all_time',
        templateOptions: {
          label: 'Limit To',
          required: false,
          options: [
            // this_week, this_month, this_year, all_time
            {name: 'All time', value: 'all_time'},
            {name: 'This week', value: 'this_week'},
            {name: 'This month', value: 'this_month'},
            {name: 'This year', value: 'this_year'}
          ]
        },
        watcher: {
          listener: function() {
            fetch();
          }
        }
      }
    ];

    $scope.$watch(
      function() { return CurrentUser.data.feed.records},
      function(records){
        var meta = CurrentUser.data.feed._meta;

        vm.count = Number(meta.per_page);
        vm.page = Number(meta.current_page);
        vm.totalItems = Number(meta.total_count);
        vm.totalPages = Number(meta.total_pages);

        vm.totalUnseenNotifications = _.filter(records, function(n) {
          return n.seen === false;
        }).length;

        vm.notifications = CurrentUser.data.feed.records;

        vm.categories = [
          {
            name: 'All',
            state: 'account.notifications({category:"all"})',
            count: records.length
          },
          {
            name: 'Mentions',
            state: 'account.notifications({category:"mentions"})',
            count: _(records).filter({type: 'mention'}).value().length
          },
          {
            name: 'Subscribed Events',
            state: 'account.notifications({category:"subscribed_events"})',
            count: _(records).filter({type: 'subscribed_event'}).value().length
          }
        ];
      }, true);

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead().then(function() {
        console.log('records marked as seen');
      });
    }
  }
})();
