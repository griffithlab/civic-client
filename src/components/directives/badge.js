(function() {
  'use strict';
  angular.module('civic.common')
    .directive('trophyBadge', badge);

  // @ngInject
  function badge() {
    return {
      restrict: 'E',
      scope: {
        badge: '='
      },
      templateUrl: 'components/directives/badge.tpl.html',
      controller: badgeController
    };
  }

  // @ngInject
  function badgeController($scope, $state, $previousState) {
    var vm = $scope.vm = {};
    vm.badge = $scope.badge;
  }
})();
