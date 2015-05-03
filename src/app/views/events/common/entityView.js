(function() {
  angular.module('civic.events.common')
    .controller('EntityViewController', EntityViewController)
    .directive('entityView', function() {
      return {
        restrict: 'E',
        scope: {
          viewModel: '=',
          viewOptions: '='
        },
        transclude: true,
        controller: 'EntityViewController',
        templateUrl: 'app/views/events/common/entityView.tpl.html'
      }
    });

  //@ngInject
  function EntityViewController($scope) {
    // entityViewModel and entityViewOptions are defined in [entity]ViewControllers, and passed to
    // this directive in [entity]View templates. This controller can then be required by child common components
    // to obtain references to view models and view options.
    this.entityViewModel = $scope.viewModel;
    this.entityViewOptions= $scope.viewOptions;
  }

})();
