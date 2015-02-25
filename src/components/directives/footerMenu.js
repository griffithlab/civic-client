(function() {
  'use strict';
  angular.module('civic.common')
    .directive('footerMenu', footerMenu);

// @ngInject
  function footerMenu() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/directives/footerMenu.tpl.html',
      replace: true,
      scope: true,
      controller: FooterMenuController
    };

    return directive;
  }

// @ngInject
  function FooterMenuController($scope, ConfigService) {
    $scope.menuItems = ConfigService.footerMenuItems;
  }
})();
