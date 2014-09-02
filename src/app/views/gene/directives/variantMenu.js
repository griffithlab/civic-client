angular.module('civic.gene')
  .directive('variantMenu', eventMenu);

// @ngInject
function eventMenu() {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'views/gene/directives/variantMenu.tpl.html',
    controller: 'GeneCtrl',
    replace: true,
    scope: true,
    link: function($scope) {
      console.log('variantMenu linked.');
    }
  };

  return directive;
}