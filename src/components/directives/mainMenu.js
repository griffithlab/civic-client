(function() {
  'use strict';
  angular.module('civic.common')
    .directive('mainMenu', mainMenu);

  // @ngInject
  function mainMenu() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/directives/mainMenu.tpl.html',
      replace: true,
      scope: true,
      controller: mainMenuController
    };

    return directive;
  }

  // @ngInject
  function mainMenuController($scope, ConfigService) {
    $scope.menuItems = ConfigService.mainMenuItems;
  }
})();
