(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTable', evidenceTable);

// @ngInject
  function evidenceTable() {
    var directive = {
      restrict: 'E',
      templateUrl: '/civic-client/views/events/variants/directives/evidenceTable.tpl.html',
      replace: true,
      scope: false,
      controller: function($scope, $state, $stateParams, $location, $log) {
        $scope.rowClick = function(evidenceId) {
          $state.go('events.genes.summary.variants.summary.evidence.summary', {
            geneId: $stateParams.geneId,
            variantId: $stateParams.variantId,
            evidenceId: evidenceId
          })
        };
      }
    };

    return directive;
  }
})();