(function() {
  'use strict';
  angular.module('civic.events')
    .controller('EventsViewCtrl', EventsViewCtrl);

  // @ngInject
  function EventsViewCtrl($log, $rootScope, $scope, Genes) {
    $log.info("EventsViewCtrl loaded.");
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Choose Gene')

    $scope.genes = Genes.query();
  }
})();