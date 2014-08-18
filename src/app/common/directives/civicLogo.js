angular.module('civic.common')
  .directive('civicLogo', civicLogo);

/**
 * @ngInject
 */
function civicLogo($log) {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'common/directives/civicLogo.tpl.html',
    controller: civicLogoController
  };

  // @ngInject
  function civicLogoController($scope, $rootScope) {
    'use strict';
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