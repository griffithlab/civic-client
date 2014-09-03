(function() {
  'use strict';
  angular.module('civic.common')
    .directive('civicLogo', civicLogo);

  /**
   * @ngInject
   */
  function civicLogo($log) {
    var directive = {
      restrict: 'E',
      templateUrl: 'common/directives/civicLogo.tpl.html',
      controller: civicLogoController
    };

    // @ngInject
    function civicLogoController($scope, $rootScope) {
      var pageState = {
        navMode: $rootScope.navMode,
        pageTitle: $rootScope.pageTitle
      };
      $log.info('civicLogoController loaded');
      $scope.navMode = $rootScope.navMode;
      $scope.pageTitle = $rootScope.pageTitle;
    }

    return directive;
  }
})();