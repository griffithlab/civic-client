(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .controller('EvidenceSummaryController', EvidenceSummaryController)
    .directive('evidenceSummary', function() {
      return {
        restrict: 'E',
        scope: {},
        controller: 'EvidenceSummaryController',
        templateUrl: 'app/views/events/evidence/summary/evidenceSummary.tpl.html'
      }
    });

  //@ngInject
  function EvidenceSummaryController($scope, Evidence, EvidenceViewOptions) {
    $scope.evidence = Evidence.data.item;
    $scope.evidence.drugs = _.chain($scope.evidence.drugs).pluck('name').value().join(", ");
//    $scope.evidence = Evidence.data.evidence;
    $scope.EvidenceViewOptions = EvidenceViewOptions;
    $scope.backgroundColor = EvidenceViewOptions.styles.view.backgroundColor;
  }
})();
