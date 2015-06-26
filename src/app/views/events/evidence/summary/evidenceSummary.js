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
      };
    });

  //@ngInject
  function EvidenceSummaryController($scope, Evidence, EvidenceViewOptions, _) {
    $scope.evidence = Evidence.data.item;
    $scope.$watch('evidence.drugs', function() {
      $scope.evidence.drugsStr = _.chain($scope.evidence.drugs).pluck('name').value().join(', ');
    });
    $scope.EvidenceViewOptions = EvidenceViewOptions;
    $scope.backgroundColor = EvidenceViewOptions.styles.view.backgroundColor;
  }
})();
