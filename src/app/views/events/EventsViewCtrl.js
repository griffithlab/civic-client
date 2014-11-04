(function() {
  'use strict';
  angular.module('civic.events')
    .controller('EventsViewCtrl', EventsViewCtrl);

  // @ngInject
  function EventsViewCtrl($log, $rootScope, $scope, $stateParams, Genes) {
    $log.info("EventsViewCtrl loaded.");
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Choose Gene')

    if (!$stateParams.geneId) {
      $scope.genes = Genes.query();
    }
  }
})();