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
      $scope.numLimit = 3;
      $scope.pathwayLimit = $scope.numLimit;
      $scope.interproLimit = $scope.numLimit;
      $scope.setPathwayLimit = function (lim) {
          $scope.pathwayLimit = (lim <= 0) ? $scope.gene.pathway.pharmgkb.length : lim;
      };
      $scope.setInterproLimit = function (lim) {
          $scope.interproLimit = (lim <= 0) ? $scope.gene.interpro.length : lim;
      };
      $scope.variantGroupsExist = typeof($scope.gene.variant_groups) === 'object';
      $rootScope.setNavMode('sub');
      $rootScope.setTitle('Event ' + $stateParams.geneId + ' / ...')
    } else {
      $state.go('events');
    }
  }
})();
