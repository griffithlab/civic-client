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
    $scope.stateParams = $stateParams;

    $scope.variantGroups = _.map(Genes.data.variantGroups, function(vg){
      vg.singleGene = _.every(vg.variants, { gene_id: vg.variants[0].gene_id });
      return vg;
    });

  }
})();
