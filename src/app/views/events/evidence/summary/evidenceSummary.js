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
  function EvidenceSummaryController($scope,
                                     $log,
                                     $stateParams,
                                     Evidence,
                                     Security,
                                     EvidenceViewOptions,
                                     _,
                                     ConfigService) {
    $scope.isEditor = Security.isEditor;
    $scope.isAuthenticated = Security.isAuthenticated;
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

    $scope.acceptItem = function(id) {
      $log.debug('accept item ' + id);
      Evidence.accept(id, $stateParams.variantId)
        .then(function(response) {
          $log.debug('Accept success.');
          $log.debug(response);
        })
        .catch(function(response) {
          $log.error('Ooops! There was an error accepting this evidence item.');
          $log.error(response);
        })
        .finally(function() {
          $log.debug('Accept Item done.');
        });
    };

    $scope.rejectItem = function(id) {
      $log.debug('reject item ' + id);
      Evidence.reject(id, $stateParams.variantId)
        .then(function(response) {
          $log.debug('Reject success.');
          $log.debug(response);
        })
        .catch(function(response) {
          $log.error('Ooops! There was an error rejecting this evidence item.');
          $log.error(response);
        })
        .finally(function() {
          $log.debug('Reject Item done.');
        });
    };
  }
})();
