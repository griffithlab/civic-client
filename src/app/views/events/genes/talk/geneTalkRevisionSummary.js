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
      require: ['^^entityTalkView', '^^entityView'],
      templateUrl: 'app/views/events/genes/talk/geneTalkRevisionSummary.tpl.html',
      link: geneTalkRevisionsSummaryLink,
      controller: 'GeneTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function geneTalkRevisionsSummaryLink(scope, element, attributes, controllers) {
    var ctrl,
      geneTalkModel,
      geneModel,
      changeId;

    ctrl = scope.ctrl = {};
    geneTalkModel = scope.geneTalkModel= controllers[0].entityTalkModel;
    geneModel = scope.geneModel = controllers[1].entityModel;
    changeId = scope.changeId;

    geneTalkModel.actions.getChange(changeId);
    geneTalkModel.actions.getChangeComments(changeId);

  }

  // @ngInject
  function GeneTalkRevisionSummaryController($scope, $stateParams) {
    // wait until models linked

    $scope.changeId = $stateParams.changeId;

    $scope.acceptChange = function() {
      $scope.geneTalkModel.actions.acceptChange($stateParams.changeId)
        .then(function() {
          $scope.geneTalkModel.actions.getChanges($stateParams.geneId); // will eventually refresh revisions data grid
          $scope.geneModel.actions.refresh(); // will eventually refresh parent gene
        });
    };

    $scope.rejectChange = function() {
      $scope.geneTalkModel.actions.rejectChange($stateParams.changeId)
        .then(function() {
          $scope.geneTalkModel.actions.getChanges($stateParams.geneId);
        });
    };
  }
})();
