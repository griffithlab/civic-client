(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .directive('variantGroupTalkRevisionSummary', variantGroupTalkRevisionSummary)
    .controller('VariantGroupTalkRevisionSummaryController', VariantGroupTalkRevisionSummaryController);

  // @ngInject
  function variantGroupTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      require: '^^entityTalkView',
      templateUrl: 'app/views/events/variantGroups/talk/variantGroupTalkRevisionSummary.tpl.html',
      link: variantGroupTalkRevisionsSummaryLink,
      controller: 'VariantGroupTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function variantGroupTalkRevisionsSummaryLink(scope, element, attributes, entityTalkView) {
    scope.variantGroupTalkModel= entityTalkView.entityTalkModel;
  }

  // @ngInject
  function VariantGroupTalkRevisionSummaryController($scope, $stateParams) {
    var ctrl = $scope.ctrl = {};
    var unwatch = $scope.$watch('variantGroupTalkModel', function(variantGroupTalkModel) {
      console.log('ctrl.variantGroupTalkRevisionsModel watch triggered.');
      variantGroupTalkModel.actions.getChange($stateParams.changeId);
      variantGroupTalkModel.actions.getChangeComments($stateParams.changeId);

      ctrl.acceptChange = function() {
        variantGroupTalkModel.actions.acceptChange($stateParams.changeId)
          .then(function(response) {
            variantGroupTalkModel.actions.getChanges($stateParams.variantId);
          });
      };

      ctrl.rejectChange = function() {
        variantGroupTalkModel.actions.rejectChange($stateParams.changeId)
          .then(function(response) {
            variantGroupTalkModel.actions.getChanges($stateParams.variantId);
          });
      };

      unwatch();
    });
  }
})();
