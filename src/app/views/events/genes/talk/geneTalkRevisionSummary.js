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
    scope.geneTalkModel= controllers[0].entityTalkModel;
    scope.geneModel = controllers[1].entityModel;
  }

  // @ngInject
  function GeneTalkRevisionSummaryController($scope, $stateParams) {
    var ctrl = $scope.ctrl = {};

    var unwatch = $scope.$watchCollection('[geneTalkModel, geneModel]', function(controllers) {
      console.log('ctrl.geneTalkRevisionsModel watch triggered.');
      var geneTalkModel = controllers[0];
      var geneModel = controllers[1];

      geneTalkModel.actions.getChange($stateParams.changeId);
      geneTalkModel.actions.getChangeComments($stateParams.changeId);

      ctrl.acceptChange = function() {
        geneTalkModel.actions.acceptChange($stateParams.changeId)
          .then(function(response) {
            geneTalkModel.actions.getChanges($stateParams.geneId); // will eventually refresh revisions data grid
            geneModel.actions.refresh(); // will eventually refresh parent gene
          });
      };

      ctrl.rejectChange = function() {
        geneTalkModel.actions.rejectChange($stateParams.changeId)
          .then(function(response) {
            geneTalkModel.actions.getChanges($stateParams.geneId);
          });
      };

      unwatch(); // watcher will only be executed once
    }, true); // use object equality
  }
})();
