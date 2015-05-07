(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .controller('EvidenceSummaryController', EvidenceSummaryController)
    .directive('evidenceSummary', function() {
      return {
        restrict: 'E',
        scope: {
          showEvidenceGrid: '='
        },
        controller: 'EvidenceSummaryController',
        templateUrl: 'app/views/events/evidence/summary/evidenceSummary.tpl.html'
      }
    });

  //@ngInject
  function EvidenceSummaryController($scope, Evidence, EvidenceViewOptions) {
    $scope.evidence = Evidence.data.item;
//    $scope.evidence = Evidence.data.evidence;
    $scope.EvidenceViewOptions = EvidenceViewOptions;
    $scope.backgroundColor = EvidenceViewOptions.styles.view.backgroundColor;
  }
})();
