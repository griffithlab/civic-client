(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .controller('EvidenceTalkRevisionsController', EvidenceTalkRevisionsController)
    .directive('evidenceTalkRevisions', EvidenceTalkRevisionsDirective);

  // @ngInject
  function EvidenceTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'EvidenceTalkRevisionsController',
      templateUrl: 'app/views/events/evidence/talk/revisions/evidenceTalkRevisions.tpl.html'
    };
  }

  // @ngInject
  function EvidenceTalkRevisionsController($scope, EvidenceRevisions, EvidenceTalkViewOptions) {
    $scope.evidenceRevisions = EvidenceRevisions;
    $scope.viewOptions = EvidenceTalkViewOptions;
  }

})();
