(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceTalkComments', evidenceTalkComments)
    .controller('EvidenceTalkCommentsController', EvidenceTalkCommentsController);

  // @ngInject
  function evidenceTalkComments() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/evidence/directives/evidenceTalkComments.tpl.html',
      controller: 'EvidenceTalkCommentsController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceTalkCommentsController(Security, $scope, $stateParams, EvidenceComments, $log) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isAdmin = Security.isAdmin;

    $scope.comments = [];

    $log.info('EvidenceTalkCommentsController instantiated.');
    EvidenceComments.query({
      geneId: $stateParams.geneId,
      variantId: $stateParams.variantId,
      evidenceItemId: $stateParams.evidenceItemId
    }).$promise
      .then(function(response) {
        $log.info("loaded evidence talk comments.");
        $scope.comments = response;
      },
      function(response) {
        $log.info("failed to load evidence talk comments.");
      });
  }
})();
