(function() {
  'use strict';
  angular.module('civic.events.common')
  .directive('entityUsersPopover', entityUsersPopoverDirective)
  .controller('EntityUsersPopoverController', EntityUsersPopoverController);

  // @ngInject
  function entityUsersPopoverDirective() {
    return {
      restrict: 'E',
      scope: {
        users: '=',
        type: '=',
        name: '='
      },
      controller: 'EntityUsersPopoverController',
      templateUrl: 'app/views/events/common/entityUsersPopover.tpl.html'
    };
  }

  // @ngInject
  function EntityUsersPopoverController($scope) {
    var vm = $scope.vm = {};
    vm.users = $scope.users;
    vm.usersPopover = {
      templateUrl: 'app/views/events/common/entityUsersPopoverTemplate.tpl.html',
      title: ''
    };

    $scope.$watch('name', function(name) {
      vm.usersPopover.title = $scope.type + ' ' + name + ' Updates';
    });

    $scope.$watchCollection('users', function(users) {
      vm.users = users;
    });
  }
})();
