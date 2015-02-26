(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTalkChange', evidenceTalkChange)
    .controller('EvidenceTalkChangeController', EvidenceTalkChangeController);

  // @ngInject
  function evidenceTalkChange(Security) {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceTalkChange.tpl.html',
      controller: 'EvidenceTalkChangeController',
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function EvidenceTalkChangeController($scope, $stateParams, EvidenceSuggestedChanges, EvidenceSuggestedChangesComments, Evidence, $log) {
    $log.info('Requesting change:' + $stateParams.geneId + 'suggestedChangeId: ' + $stateParams.suggestedChangeId);

    EvidenceSuggestedChanges
      .get({
        'geneId': $stateParams.geneId,
        'variantId': $stateParams.variantId,
        'evidenceItemId': $stateParams.evidenceItemId,
        'suggestedChangeId': $stateParams.suggestedChangeId
      }).$promise
      .then(function(response) { // success!
        $log.info("Fetched evidence suggested change");
        $scope.suggestedChange = response;
      },
      function(response) {
        $log.info("Failed to fetch evience suggested change: " + response.data);
    });

    EvidenceSuggestedChangesComments
      .query({
        'geneId': $stateParams.geneId,
        'variantId': $stateParams.variantId,
        'evidenceItemId': $stateParams.evidenceItemId,
        'suggestedChangeId': $stateParams.suggestedChangeId
      })
      .$promise.then(function(response) {
        $log.info("Loaded evidence talk change comments.");
        $scope.changeComments = response;
      }, function(response) {
        $log.error("FAILED TO LOAD EVIDENCE CHANGE COMMENTS");
      });

    $scope.commitChange = function() {
      EvidenceSuggestedChanges.accept({
        'geneId': $stateParams.geneId,
        'variantId': $stateParams.variantId,
        'evidenceItemId': $stateParams.evidenceItemId,
        'suggestedChangeId': $stateParams.suggestedChangeId,
        force: true
      }).$promise
        .then(function(response) { // success
          $log.info("suggested change updated!!");
          Evidence.get({
            'geneId': $stateParams.geneId,
            'variantId': $stateParams.variantId,
            'evidenceItemId': $stateParams.evidenceItemId,
            'suggestedChangeId': $stateParams.suggestedChangeId
          }).$promise
            .then(function(evidenceItem) {
              // TODO: refactor the $parent call to something less kludgy
              $scope.$parent.evidence = evidenceItem;
            });
        },
        function(response) { // failure
          $log.info("suggested change failed!!");
        })
    };
  }
})();
