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
  function GeneTalkRevisionSummaryController($scope, $stateParams, Genes, GeneRevisions, GenesTalkViewOptions) {
    // wait until models linked

    var ctrl,
      geneTalkModel,
      geneModel,
      changeId;

    ctrl = $scope.ctrl = {};
    $scope.geneTalkModel = GeneRevisions;
    geneModel = $scope.geneModel = Genes;
    changeId = $scope.changeId;
    $scope.changeId = $stateParams.changeId;

    $scope.acceptRevision = function() {
      $scope.geneTalkModel.acceptRevision($stateParams.changeId)
        .then(function() {
          Genes.queryFresh($stateParams.geneId);
        });
    };

    $scope.rejectRevision = function() {
      $scope.geneTalkModel.rejectRevision($stateParams.changeId);
    };
  }
})();
