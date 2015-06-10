(function() {
  angular.module('civic.events.common')
  .directive('entityUsersPopover', entityUsersPopoverDirective)
  .controller('EntityUsersPopoverController', EntityUsersPopoverController);

  // @ngInject
  function entityUsersPopoverDirective() {
    return {
      restrict: 'E',
      scope: {
        users: '=',
        type: '='
      },
      controller: 'EntityUsersPopoverController',
      templateUrl: 'app/views/events/common/entityUsersPopover.tpl.html'
    }
  }

  // @ngInject
  function EntityUsersPopoverController($scope) {
    console.log('EntityUsersPopoverController called.');
    var vm = $scope.vm = {};
    vm.usersPopover = {
      templateUrl: 'app/views/events/common/entityUsersPopoverTemplate.tpl.html',
      title: $scope.type + ' Updates'
    };
    vm.users = $scope.users;
  }
})();
