angular.module('civic.common')
  .directive('mainMenu', mainMenu);
/**
 * @name mainMenu
 * @desc generates the app main menu
 * @returns {{restrict: string, templateUrl: string, replace: boolean, scope: boolean}}
 * @ngInject
 */
function mainMenu() {
  'use strict';

  function mainMenuController($scope, ConfigService) {
    $scope.menuItems = ConfigService.mainMenuItems;
  }

  var directive = {
    restrict: 'E',
    templateUrl: 'common/directives/mainMenu.tpl.html',
    replace: true,
    scope: true,
    controller: mainMenuController
  };

  return directive;
}