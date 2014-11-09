(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($log, $rootScope, $scope, $state,  $stateParams, Genes, CivicGenes) {
    $log.info("GenesViewCtrl loaded.");
    
    $scope.gene = {};
    $scope.civicGene = {};
    // if no geneId supplied, reroute to /events so that user can choose a gene
    if($stateParams.geneId) {
      var geneName;
      $scope.gene = Genes.get({'geneId': $stateParams.geneId });
      $scope.civicGene = CivicGenes.get({'geneId': $stateParams.geneId}, function(data){  
       // $rootScope.setTitle('Gene ' + data.entrez_name + ' / ...')
      });
      $scope.numLimit = 3;
      $scope.pathwayLimit = $scope.numLimit;
      $scope.interproLimit = $scope.numLimit;
      $scope.setPathwayLimit = function (lim) {
          $scope.pathwayLimit = (lim <= 0) ? $scope.gene.pathway.length : lim;
      };
      $scope.setInterproLimit = function (lim) {
          $scope.interproLimit = (lim <= 0) ? $scope.gene.interpro.length : lim;
      };
      $scope.variantGroupsExist = typeof($scope.gene.variant_groups) === 'object';
      $rootScope.setNavMode('sub');
    } else {
      $state.go('events');
    }
  }
})();
