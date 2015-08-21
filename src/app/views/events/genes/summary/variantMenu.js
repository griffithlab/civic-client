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
  function VariantMenuController($scope, $state, $stateParams, Genes, Security) {
    $scope.gene = Genes.data.item;
    $scope.variants = Genes.data.variants;
    $scope.stateParams = $stateParams;
    $scope.security = {
      isAuthenticated: Security.isAuthenticated(),
      isAdmin: Security.isEditor()
    };

    $scope.variantGroups = _.map(Genes.data.variantGroups, function(vg){
      vg.singleGene = _.every(vg.variants, { gene_id: vg.variants[0].gene_id });
      return vg;
    });
  }
})();
