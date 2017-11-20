(function() {
  'use strict';

  angular.module('civic.common')
    .directive('organizationCard', organizationCardDirective)
    .controller('OrganizationCardController', OrganizationCardController);

  // @ngInject
  function organizationCardDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        organization: '='
      },
      controller: 'OrganizationCardController as vm',
      bindToController: true,
      templateUrl: 'components/directives/organizationCard.tpl.html'
    };
  }

  // @inject
  function OrganizationCardController($state, $scope, _) {
    var vm = this;

    $scope.$watch('vm.organization', function(user) {
      vm.hasSocialProfile = !_.isEmpty(user.twitter_handle) ||
        !_.isEmpty(user.linkedin_profile) ||
        !_.isEmpty(user.facebook_profile);
    }, true);


    vm.userClick = function(id) {
      $state.go('users.profile', { userId: id});
    };

  }
})();
