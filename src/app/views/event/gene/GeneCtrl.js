(function() {
  'use strict';
  angular.module('civic.event')
    .controller('GeneCtrl', GeneCtrl);

// @ngInject
  function GeneCtrl($log, $scope, $rootScope, $state, $stateParams, $stickyState, Genes) {
    $log.info('GeneCtrl loaded.');

    $scope.gene = Genes.query({ geneId: $stateParams.geneId });

    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Event ' + $stateParams.geneId + ' / ');




    // if we're viewing the gene state and not its children, show the summary child state
//      if($state.current.name == "event.gene"){
//        $state.go('event.gene.summary');
//      }

    var geneId = $stateParams.geneId;
    var variantId = $rootScope.$state.params.variantId;

  }
})();