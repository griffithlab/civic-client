(function() {
  angular.module('civic.events.common')
    .controller('EntityTalkViewController', EntityTalkViewController)
    .directive('entityTalkView', function() {
      return {
        restrict: 'E',
        scope: {
          entityTalkModel: '='
        },
        transclude: true,
        controller: 'EntityTalkViewController',
        templateUrl: 'app/views/events/common/entityTalkView.tpl.html'
      }
    });

  //@ngInject
  function EntityTalkViewController($scope) {
    this.entityTalkModel = $scope.entityTalkModel; // attach entityTalkModel to controller for child directives
  }
})();
