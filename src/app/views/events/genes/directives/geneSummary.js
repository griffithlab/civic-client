(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneSummary', geneSummary)
    .controller('GeneSummaryController', GeneSummaryController);

// @ngInject
  function geneSummary() {
    var directive = {
      restrict: 'E',
      scope: {
        'gene': '=gene',
        'geneDetails': '=geneDetails'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneSummary.tpl.html',
      controller: 'GeneSummaryController'
    };

    return directive;
  }

  // @ngInject
  function GeneSummaryController($scope, $log) {
    $log.info('GeneSummaryController instantiated. ========');
    var ctrl = $scope.ctrl = {};
  }

})();
