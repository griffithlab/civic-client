(function() {
  'use strict';
  angular.module('civic.events.genes')
    .directive('geneTalkRevisionSummary', geneTalkRevisionSummary)
    .controller('GeneTalkRevisionSummaryController', GeneTalkRevisionSummaryController);

  // @ngInject
  function geneTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/talk/revisions/geneTalkRevisionSummary.tpl.html',
      controller: 'GeneTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function GeneTalkRevisionSummaryController($scope, $stateParams, Genes, GeneRevisions) {
    $scope.ctrl = {};
    $scope.geneTalkModel = GeneRevisions;
    $scope.changeId = $stateParams.changeId;

    $scope.acceptRevision = function() {
      GeneRevisions.acceptRevision($stateParams.geneId, $stateParams.revisionId)
        .then(function() {
          Genes.getFresh($stateParams.geneId);
        });
    };

    $scope.rejectRevision = function() {
      GeneRevisions.rejectRevision($stateParams.geneId, $stateParams.revisionId);
    };
  }
})();
