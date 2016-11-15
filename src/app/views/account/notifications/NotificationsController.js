(function() {
  'use strict';
  angular.module('civic.account')
    .controller('AccountNotificationsController', AccountNotificationsController)
    .filter('trimPlural', trimPlural);

  // @ngInject
  function trimPlural(_) {
    return function(input) {
      if (!_.isNull(input) && !_.isUndefined(input)) {
        if (input.substring(input.length, input.length - 1) === 's') {
          return input.substring(0, input.length - 1);
        } else {
          return input;
        }
      } else {
        return;
      }
    };
  }

  // @ngInject
  function AccountNotificationsController($scope,
                                          $location,
                                          $rootScope,
                                          $stateParams,
                                          CurrentUser,
                                          Security,
                                          _) {
    var vm = $scope.vm = {};

    // set up collections that generate menu and notifications list
    vm.categories = [];
    vm.notifications = [];

    // assign page params to vm from $stateParams, or defaults
    _.defaults(vm,
      {
        category: $stateParams.category,
        page: Number($stateParams.page),
        count: Number($stateParams.count)
      },
      {
        category: 'all',
        page: 1,
        count: 10
      });

    // assign filter params
    vm.filters = {};
    _.defaults(vm.filters,
      {
        // convert show_read, _unlinkable to bools if necessary
        show_read: _.isString($stateParams.show_read) ? $stateParams.show_read === 'true' : $stateParams.show_read,
        show_unlinkable: _.isString($stateParams.show_unlinkable) ? $stateParams.show_unlinkable === 'true' : $stateParams.show_unlinkable,
        limit: $stateParams['filter[limit]'],
        name: $stateParams['filter[name]']
      },
      {
        show_read: false,
        show_unlinkable: false,
        limit: 'all_time',
        name: ''
      });

    vm.countOptions= [10,25,50,100]; // per-page dropdown options

    // set up filter fields
    vm.filterFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Find User',
          required: false
        },
        watcher: {
          listener: function(field, newValue, oldValue) {
            if(newValue !== oldValue) {
              vm.fetch();
            }
          }
        }
      },
      {
        key: 'limit',
        type: 'select',
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
          listener: function(field, newValue, oldValue) {
            if(newValue !== oldValue) {
              vm.fetch();
            }
          }
        }
      },
      {
        key: 'show_unlinkable',
        type: 'checkbox',
        templateOptions: {
          label: 'Show Unlinkable',
          required: false
        },
        watcher: {
          listener: function(field, newValue, oldValue) {
            if(newValue !== oldValue) {
              vm.fetch();
            }
          }
        }
      },
      {
        key: 'show_read',
        type: 'checkbox',
        templateOptions: {
          label: 'Show Read',
          required: false
        },
        watcher: {
          listener: function(field, newValue, oldValue) {
            if(newValue !== oldValue) {
              vm.fetch();
            }
          }
        }
      }
    ];

    // create categories array to populate sidebar menu
    function generateCategories() {
      // Security.currentUser currently stores the best representation of available categories
      // TODO: probably should make this info available via a more appropriate endpoint
      vm.unread = Security.currentUser.unread_notifications;

      vm.categories = [{
        name: 'all',
        unread: _.reduce(vm.unread, function(res, val) {
          return res + val;
        })
      }];

      _.forEach(vm.unread, function(val, key) {
        vm.categories.push({
          name: key,
          unread: val
        });
      });
    }

    // fetch the user's feed using vm.category, vm.page etc.
    vm.fetch =  function() {
      var params = {
        page: Number(vm.page),
        count: Number(vm.count),
        category: vm.category,
        show_read: vm.filters.show_read,
        show_unlinkable: vm.filters.show_unlinkable
      };

      if(!_.isEmpty(vm.filters.name)) {
        params['filter[name]'] = vm.filters.name;
      }
      if(!_.isEmpty(vm.filters.limit)) {
        params['filter[limit]'] = vm.filters.limit;
      }

      CurrentUser.getFeed(params).then(function(response) {
        var meta = response._meta;
        vm.totalItems = Number(meta.total_count);
        vm.totalPages = Number(meta.total_pages);

        vm.unread = Number(meta.unread);
        vm.totalUnread = _.reduce(vm.unread, function(result, value) {
          return result + value;
        });

        generateCategories();
        // TODO: figure out how to specify filter[] query params in $stateProvider so we can keep track of those in the URL as well - until then, omit these from the query params update
        $location.search(_.omit(params, ['filter[limit]', 'filter[name]']));

        angular.copy(response.records, vm.notifications);
      });
    };

    vm.fetch();

    // called from sidebar menu item onClick
    vm.changeCategory = function(category) {
      vm.category = category;
      vm.page = 1;
      vm.fetch();
    };

    // called from pagination control
    vm.pageChanged = function() {
      vm.fetch();
    };

    vm.markAllAsRead = function() {
      CurrentUser.markAllAsRead($stateParams).then(function () {
        console.log('records marked as seen');
        vm.fetch();
      });
    };

  }
})();
