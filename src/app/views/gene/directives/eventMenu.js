angular.module('civic.event')
  .directive('eventMenu', eventMenu);

// @ngInject
function eventMenu() {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'views/gene/directives/eventMenu.tpl.html',
    controller: 'GeneCtrl',
    replace: true,
    scope: true,
    link: function($scope) {
      console.log('variantMenu linked.');
    }
  };

  return directive;
}