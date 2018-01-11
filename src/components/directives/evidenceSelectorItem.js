(function() {
  'use strict';
  angular.module('civic.common')
    .directive('evidenceSelectorItem', evidenceSelectorItem);

  // @ngInject
  function evidenceSelectorItem() {
    return {
      restrict: 'E',
      scope: {
        item: '=',
        removeFn: '='
      },
      templateUrl: 'components/directives/evidenceSelectorItem.tpl.html',
      controller: evidenceSelectorItemController
    };
  }

  // @ngInject
  function evidenceSelectorItemController($scope, $state, _, Genes, Variants) {
    var ctrl = $scope.ctrl = {};
    ctrl.item = $scope.item;
    ctrl.removeItem = $scope.removeFn;

    Genes.get(ctrl.item.gene_id).then(function(gene) {
      ctrl.item.gene = gene;
    });

    Variants.get(ctrl.item.variant_id).then(function(variant) {
      ctrl.item.variant = variant;
    });

  }
})();
