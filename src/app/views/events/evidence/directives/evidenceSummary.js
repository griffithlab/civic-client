(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceSummary', evidenceSummary)
    .controller('EvidenceSummaryController', EvidenceSummaryController);

// @ngInject
  function evidenceSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceSummary.tpl.html',
      controller: 'EvidenceSummaryController'
    };

    return directive;
  }

  // @ngInject
  function EvidenceSummaryController($scope) {
    var evidenceLevelLabels = {
      'A': 'Validated',
      'B': 'Clinical',
      'C': 'Preclinical',
      'D': 'Inferential'
    };
    $scope.evidence.$promise.then(function() {
      $scope.evidence.evidenceLevelLabel = evidenceLevelLabels[$scope.evidence.evidence_level];
    });
  }

})();
