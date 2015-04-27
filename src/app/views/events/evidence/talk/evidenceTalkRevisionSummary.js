(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .directive('evidenceTalkRevisionSummary', evidenceTalkRevisionSummary)
    .controller('EvidenceTalkRevisionSummaryController', EvidenceTalkRevisionSummaryController);

  // @ngInject
  function evidenceTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      require: '^^entityTalkView',
      templateUrl: 'app/views/events/evidence/talk/evidenceTalkRevisionSummary.tpl.html',
      link: evidenceTalkRevisionsSummaryLink,
      controller: 'EvidenceTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function evidenceTalkRevisionsSummaryLink(scope, element, attributes, entityTalkView) {
    scope.evidenceTalkModel= entityTalkView.entityTalkModel;
  }

  // @ngInject
  function EvidenceTalkRevisionSummaryController($scope, $stateParams) {
    var ctrl = $scope.ctrl = {};
    var unwatch = $scope.$watch('evidenceTalkModel', function(evidenceTalkModel) {
      console.log('ctrl.evidenceTalkRevisionsModel watch triggered.');
      evidenceTalkModel.actions.getChange($stateParams.changeId);
      evidenceTalkModel.actions.getChangeComments($stateParams.changeId);

      ctrl.acceptChange = function() {
        evidenceTalkModel.actions.acceptChange($stateParams.changeId)
          .then(function(response) {
            evidenceTalkModel.actions.getChanges($stateParams.variantId);
          });
      };

      ctrl.rejectChange = function() {
        evidenceTalkModel.actions.rejectChange($stateParams.changeId)
          .then(function(response) {
            evidenceTalkModel.actions.getChanges($stateParams.variantId);
          });
      };

      unwatch();
    });
  }
})();
