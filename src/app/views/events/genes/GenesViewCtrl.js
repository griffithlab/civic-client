(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($log, $rootScope, $scope, $state,  $stateParams, Genes, MyGene) {
    $log.info('GenesViewCtrl loaded.');

    $scope.gene = {};
    $scope.geneDetails = {};

    // if no geneId supplied, reroute to /events so that user can choose a gene
    // else fetch data to render genes view
    if(!$stateParams.geneId) {
      $state.go('events');
    } else {
      $scope.gene = Genes.get({'geneId': $stateParams.geneId });
      $scope.geneDetails = MyGene.getDetails({'geneId': $stateParams.geneId });
      /*jshint camelcase: false */
      $scope.gene.$promise.then(function(gene) {
        $scope.variantGroupsExist = typeof(gene.variant_groups) === 'object';
        $rootScope.setNavMode('sub');
        $rootScope.setTitle('Event ' + gene.entrez_name + ' / ...');
      });


    }
  }
})();
