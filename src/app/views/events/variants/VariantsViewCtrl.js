(function() {
  'use strict';
  angular.module('civic.events')
    .controller('VariantsViewCtrl', VariantsViewCtrl);

  // @ngInject
  function VariantsViewCtrl($log, $rootScope, $scope, $state, $stateParams, Variants, CivicGenes) {
    $log.info("VariantsViewCtrl loaded.");

    $scope.variant = {};
    // if no variant ID supplied, reroute to events.genes.summary so that user can choose a variant
    if($stateParams.variantId) {
      $scope.variant = Variants.get({'geneId': $stateParams.geneId, variantId: $stateParams.variantId }, function(data){ 
        console.log(data)
        $rootScope.setTitle('Variant ' +  data.entrez_name + ' / ' + data.name);
      });
      $rootScope.setNavMode('sub');
    } else {
      $state.go('events.genes.summary', { geneId: $stateParams.geneId });
    }

  }
})();
