(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($log, $rootScope, $scope, $state,  $stateParams, Genes) {
    $log.info("GenesViewCtrl loaded.");

    $scope.gene = {};
    // if no geneId supplied, reroute to /events so that user can choose a gene
    if($stateParams.geneId) {
      $scope.gene = Genes.get({'geneId': $stateParams.geneId });
      $rootScope.setNavMode('sub');
      $rootScope.setTitle('Event ' + $stateParams.geneId + ' / ...')
    } else {
      $state.go('events');
    }
  }
})();