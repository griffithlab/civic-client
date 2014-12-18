(function() {
  'use strict';
  angular.module('civic.events')
    .controller('EventsViewCtrl', EventsViewCtrl);

  // @ngInject
  // jshint unused: false
  // NOTE: $deepStateRedirect is required for events state's onExit function in appStates.js
  function EventsViewCtrl($log, $scope, $stateParams, Genes, $deepStateRedirect) {
    if (!$stateParams.geneId) {
      $scope.genes = Genes.queryNames();
    }
  }
})();
