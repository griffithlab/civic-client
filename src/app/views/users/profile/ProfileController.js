(function() {
  'use strict';
  angular.module('civic.users.profile')
  .controller('ProfileController', ProfileController);

  // @ngInject
  function ProfileController($scope, Security, user, events) {
    var vm = $scope.vm = {};
    console.log('ProfileController called. user: ');
    console.log(user);

    vm.user = user;
    vm.events = events;
  }
})();
