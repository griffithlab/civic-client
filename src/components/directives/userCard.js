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
  function UserCardController($state, $scope, _) {
    var vm = this;

    $scope.$watch('vm.user', function(user) {
      vm.hasSocialProfile = !_.isEmpty(user.url) ||
        !_.isEmpty(user.twitter_handle) ||
        !_.isEmpty(user.linkedin_profile) ||
        !_.isEmpty(user.facebook_profile);
    }, true);


    vm.userClick = function(id) {
      $state.go('users.profile', { userId: id});
    };

  }
})();
