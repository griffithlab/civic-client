(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkRevisionSummary', geneTalkRevisionSummary)
    .controller('GeneTalkRevisionSummaryController', GeneTalkRevisionSummaryController);

  // @ngInject
  function geneTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      require: '^^entityTalkView',
      templateUrl: 'app/views/events/genes/talk/geneTalkRevisionSummary.tpl.html',
      link: geneTalkRevisionsSummaryLink,
      controller: 'GeneTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function geneTalkRevisionsSummaryLink(scope, element, attributes, entityTalkView) {
    scope.geneTalkModel= entityTalkView.entityTalkModel;
  }

  // @ngInject
  function GeneTalkRevisionSummaryController($scope, $stateParams) {
    var ctrl = $scope.ctrl = {};
    var unwatch = $scope.$watch('geneTalkModel', function(geneTalkModel) {
      console.log('ctrl.geneTalkRevisionsModel watch triggered.');
      geneTalkModel.actions.getChange($stateParams.changeId);
      geneTalkModel.actions.getChangeComments($stateParams.changeId);
      unwatch();
    });

    $scope.$watchCollection('geneTalkModel.data.changeComments', function(comments) {
      console.log('change comments updated.');
    });
  }
})();
