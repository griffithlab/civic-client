(function() {
  'use strict';

  angular.module('civic.common')
    .directive('userCard', userCardDirective)
    .controller('UserCardController', UserCardController);

  // @ngInject
  function userCardDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        user: '='
      },
      controller: 'UserCardController as vm',
      bindToController: true,
      templateUrl: 'components/directives/userCard.tpl.html'
    };
  }

  // @inject
  function UserCardController($state) {
    console.log('userCard controller called.');
    var vm = this;

    vm.userClick = function(id) {
      $state.go('users.profile', { userId: id});
    };

  }
})();
