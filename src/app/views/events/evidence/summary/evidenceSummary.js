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
  function EvidenceSummaryController($scope, Evidence, EvidenceViewOptions, _, ConfigService) {
    $scope.evidence = Evidence.data.item;
    $scope.tipText = ConfigService.evidenceAttributeDescriptions;

    var evidence_levels = {
      A: 'Validated',
      B: 'Clinical',
      C: 'Preclinical',
      D: 'Case Study',
      E: 'Inferential'
    };
    $scope.$watchCollection('evidence', function() {
      $scope.evidence.evidence_level_string = $scope.evidence.evidence_level + ' - ' + evidence_levels[$scope.evidence.evidence_level];
      $scope.evidence.drugsStr = _.chain($scope.evidence.drugs).pluck('name').value().join(', ');
    });

    $scope.EvidenceViewOptions = EvidenceViewOptions;
    $scope.backgroundColor = EvidenceViewOptions.styles.view.backgroundColor;
  }
})();
