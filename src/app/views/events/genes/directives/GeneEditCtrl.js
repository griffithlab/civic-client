(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GeneEditCtrl', GeneEditCtrl);

  // @ngInject
  function GeneEditCtrl($log, $rootScope, $scope, $stateParams, Genes) {
    $log.info("GeneEditCtrl loaded.");
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Edit Gene ' + $stateParams.geneId);

    $scope.geneEdit = Genes.get({'geneId': $stateParams.geneId });

    $scope.submitEdits = function() {
      $scope.geneEdit.$update({
        description: $scope.geneEdit.description
      });
    }
  }
})();