(function() {
  'use strict';
  angular.module('civic.common')
    .directive('civicLogo', civicLogo);

  // @ngInject
  function civicLogo() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/directives/civicLogo.tpl.html',
      controller: civicLogoController
    };
    return directive;
  }

  // @ngInject
  function civicLogoController($scope, $rootScope, $log) {
    var pageState = {
      navMode: $rootScope.navMode,
      pageTitle: $rootScope.pageTitle
    };
    $log.info('civicLogoController loaded');
    $scope.navMode = $rootScope.navMode;
    $scope.pageTitle = $rootScope.pageTitle;
  }
})();
