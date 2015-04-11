(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('VariantMenuController', VariantMenuController)
    .directive('variantMenu', function() {
      return {
        restrict: 'E',
        scope: {
          variants: '=',
          variantGroups: '=',
          options: '='
        },
        controller: 'VariantMenuController',
        templateUrl: 'app/views/events/genes/summary/variantMenu.tpl.html'
      }
    });

  //@ngInject
  function VariantMenuController($scope, $state) {
    var ctrl = $scope.ctrl = {};

    ctrl.variants = $scope.variants;
    ctrl.variantGroups = $scope.variantGroups;
    ctrl.options = {
      backgroundColor: '#CDCDCD',
      variantHeaderColor: '#4b2065'
    };
  }
})();
