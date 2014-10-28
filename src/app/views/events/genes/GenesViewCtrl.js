(function() {
  'use strict';
  angular.module('civic.events')
    .controller('GenesViewCtrl', GenesViewCtrl);

  // @ngInject
  function GenesViewCtrl($log, $rootScope, $scope, $stateParams, Genes) {
    $log.info("GenesViewCtrl loaded.");

    var geneId = $stateParams.geneId;

    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Event ' + geneId + ' / ...')

    $scope.gene = Genes.get({'geneId': geneId });

  }
})();