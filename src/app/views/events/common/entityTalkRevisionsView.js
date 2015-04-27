(function() {
  angular.module('civic.events.common')
    .controller('EntityTalkRevisionsViewController', EntityTalkRevisionsViewController)
    .directive('entityTalkRevisionsView', function() {
      return {
        restrict: 'E',
        scope: {},
        require: '^^entityTalkView',
         link: entityTalkRevisionsViewLink,
        transclude: true,
        controller: 'EntityTalkRevisionsViewController',
        templateUrl: 'app/views/events/common/entityTalkRevisionsView.tpl.html'
      }
    });

  //  @ngInject
  function entityTalkRevisionsViewLink(scope, element, attributes, entityTalkView) {
    scope.ctrl.entityTalkModel = entityTalkView.entityTalkModel;
  }

  //@ngInject
  function EntityTalkRevisionsViewController($scope) {
    this.entityTalkRevisionsModel = $scope.entityTalkRevisionsModel; // attach entityTalkRevisionsModel to controller for child directives
    var ctrl = $scope.ctrl = {};
    $scope.$watch('ctrl.entityTalkModel', function(entityTalkModel) {
      console.log('found ctrl.entityTalkModel from entitytalkrevisionsview');
    });
  }
})();
