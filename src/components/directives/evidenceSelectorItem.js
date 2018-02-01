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

    // item data could be provided by two different evidence item endpoints, extracting gene/variant id differs
    var gene_id = _.isUndefined(ctrl.item.gene_id) ? ctrl.item.state_params.gene.id : ctrl.item.gene_id;
    var variant_id = _.isUndefined(ctrl.item.variant_id) ? ctrl.item.state_params.variant.id : ctrl.item.variant_id;

    Genes.get(gene_id).then(function(gene) {
      ctrl.item.gene = gene;
    });

    Variants.get(variant_id).then(function(variant) {
      ctrl.item.variant = variant;
    });

  }
})();
