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
                                          _) {

    if(_.isUndefined($stateParams.category)) {
      $state.go('account.notifications', { category: 'all' })
    }
    var vm = $scope.vm = {};

    vm.countOptions= [10,25,50,100];
    vm.notifications = [];

    vm.unRead = Security.currentUser.unread_notifications;
    vm.category = $stateParams.category;

    vm.filters = {
      name: String(),
      limit: Number(),
      showUnseen: false,
      showUnlinkable: false
    };

    vm.pageChanged = function() {
      $location.search({page: vm.page, count: vm.count, category: vm.category});
      fetch();
    };

    var fetch = _.debounce(function() {
      var request = {
        count: vm.count,
        page: vm.page,
        category: vm.category
      };

      if(!_.isEmpty(vm.filters.name)) {
        request['filter[name]'] = vm.filters.name;
      }
      if(!_.isEmpty(vm.filters.limit)) {
        request['filter[limit]'] = vm.filters.limit;
      }

      request['filter[unlinkable]'] = vm.filters.showUnlinkable;
      request['filter[unread]'] = vm.filters.showUnseen;

      CurrentUser.getFeed(request)
    }, 250);

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
      },
      {
        key: 'showUnlinkable',
        type: 'checkbox',
        defaultValue: 'true',
        templateOptions: {
          label: 'Show Unlinkable',
          required: false
        },
        watcher: {
          listener: function() {
            fetch();
          }
        }
      },
      {
        key: 'showUnseen',
        type: 'checkbox',
        defaultValue: 'true',
        templateOptions: {
          label: 'Show Read',
          required: false
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
        vm.category = $stateParams.category;

        vm.unread = meta.unread;
        vm.totalUnread = _.reduce(vm.unread, function(result, value, key) {
          return result + value;
        });

        angular.copy(CurrentUser.data.feed.records, vm.notifications);

        vm.categories = [{
          name: 'all',
          state: 'account.notifications({category:"all", page: vm.page, count: vm.count })',
          unread: _.reduce(vm.unread, function(res, val, key) {
            return res + val;
          })
        }];

        _.forEach(vm.unread, function(val, key) {
          vm.categories.push({
            name: key,
            state: 'account.notifications({category:"' + key + '", page: vm.page, count: vm.count })',
            unread: val
          });
        });

      }, true);

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead().then(function() {
        console.log('records marked as seen');
      });
    }
  }
})();
