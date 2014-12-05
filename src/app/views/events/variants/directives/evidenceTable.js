(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTable', evidenceTable)
    .controller('EvidenceTableCtrl', EvidenceTableCtrl);

// @ngInject
  function evidenceTable() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/views/events/variants/directives/evidenceTable.tpl.html',
      replace: true,
      scope: false,
      controller: 'EvidenceTableCtrl'
    };

    return directive;
  }

  // ngInject
  function EvidenceTableCtrl($scope, $state, $stateParams, $location, $log) {
    $log.info('EvidenceTableCtrl instantiated.');

    $scope.rowClick = function(evidenceId) {
      $state.go('events.genes.summary.variants.summary.evidence.summary', {
        geneId: $stateParams.geneId,
        variantId: $stateParams.variantId,
        evidenceId: evidenceId
      })
    };
  }

})();
