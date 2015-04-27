(function() {
  'use strict';
  angular.module('civic.events.variants')
    .directive('variantTalkRevisionSummary', variantTalkRevisionSummary)
    .controller('VariantTalkRevisionSummaryController', VariantTalkRevisionSummaryController);

  // @ngInject
  function variantTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      require: '^^entityTalkView',
      templateUrl: 'app/views/events/variants/talk/variantTalkRevisionSummary.tpl.html',
      link: variantTalkRevisionsSummaryLink,
      controller: 'VariantTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function variantTalkRevisionsSummaryLink(scope, element, attributes, entityTalkView) {
    scope.variantTalkModel= entityTalkView.entityTalkModel;
  }

  // @ngInject
  function VariantTalkRevisionSummaryController($scope, $stateParams) {
    var ctrl = $scope.ctrl = {};
    var unwatch = $scope.$watch('variantTalkModel', function(variantTalkModel) {
      console.log('ctrl.variantTalkRevisionsModel watch triggered.');
      variantTalkModel.actions.getChange($stateParams.changeId);
      variantTalkModel.actions.getChangeComments($stateParams.changeId);
      unwatch();
    });
  }
})();
