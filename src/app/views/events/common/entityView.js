(function() {
  angular.module('civic.events.common')
    .controller('EntityViewController', EntityViewController)
    .directive('entityView', function() {
      return {
        restrict: 'E',
        scope: {
          entityModel: '=',
          entityViewOptions: '='
        },
        transclude: true,
        controller: 'EntityViewController',
        templateUrl: 'app/views/events/common/entityView.tpl.html'
      }
    });

  //@ngInject
  function EntityViewController($scope) {
    this.entityModel = $scope.entityModel;
    this.entityViewOptions= $scope.entityViewOptions;
  }

})();
