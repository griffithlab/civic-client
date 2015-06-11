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
        type: '=',
        name: '='
      },
      controller: 'EntityUsersPopoverController',
      templateUrl: 'app/views/events/common/entityUsersPopover.tpl.html'
    }
  }

  // @ngInject
  function EntityUsersPopoverController($scope) {
    var vm = $scope.vm = {};
    vm.users = $scope.users;
    vm.usersPopover = {
      templateUrl: 'app/views/events/common/entityUsersPopoverTemplate.tpl.html',
      title: ''
    };

    $scope.$watchGroup(['name', 'users'], function(updates, old, scope) {
      var name = updates[0];
      var users = updates[1];
      scope.name = name;
      scope.users = users;
      vm.usersPopover.title = $scope.type + ' ' + name + ' Updates'
    });
  }
})();
