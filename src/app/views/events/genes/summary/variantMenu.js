(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('VariantMenuController', VariantMenuController)
    .directive('variantMenu', function() {
      return {
        restrict: 'E',
        scope: {
          options: '='
        },
        controller: 'VariantMenuController',
        templateUrl: 'app/views/events/genes/summary/variantMenu.tpl.html'
      };
    });

  //@ngInject
  function VariantMenuController($scope, $stateParams, Genes) {
    var vm = $scope.vm = {};
    $scope.gene = Genes.data.item;
    $scope.variants = Genes.data.variants;
    $scope.variantGroups = Genes.data.variantGroups;
    $scope.stateParams = $stateParams;
    $scope.singleGene = _.every($scope.variants, _.first($scope.variants));
  }
})();
