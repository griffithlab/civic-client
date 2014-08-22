angular.module('civic.event')
  .directive('variantMenu', variantMenu);

// @ngInject
function variantMenu() {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'views/event/directives/variantMenu.tpl.html',
    replace: true,
    scope: true,
    link: function($scope) {
      console.log('variantMenu linked.');
    }
  };

  return directive;
}