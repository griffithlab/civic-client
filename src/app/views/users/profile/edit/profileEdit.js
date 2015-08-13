(function() {
  'use strict';
  angular.module('civic.users.profile')
    .controller('ProfileEditController', ProfileEditController);

  // @ngInject
  function ProfileEditController ($scope, Users, user){
    var vm = $scope.vm = {};

    vm.user = user;
    vm.userEdit = {};

    vm.userEditFields = [
      {
        key: '',
        type: 'input',
        templateOptions: {
          label: 'Display Name',
          value: 'vm.userEdit.displayname'
        }
      }
    ];
  }
})();
