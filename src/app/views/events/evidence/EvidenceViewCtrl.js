(function() {
  'use strict';
  angular.module('civic.events')
    .controller('EvidenceViewCtrl', EvidenceViewCtrl);

  // @ngInject
  function EvidenceViewCtrl($log, $rootScope, $scope, $state, $stateParams, Evidence) {
    $scope.evidence= {};
    // if no evidence ID supplied, reroute to events.genes.summary.variants.summary so that user can choose an evidence item
    if($stateParams.evidenceItemId) {
      $scope.evidence= Evidence.get({
        'geneId': $stateParams.geneId,
        'variantId': $stateParams.variantId,
        'evidenceItemId': $stateParams.evidenceItemId
      });

    } else {
      $state.go('events.genes.summary.variants.summary', { geneId: $stateParams.geneId, variantId: $stateParams.variantId });
    }
  }
})();
