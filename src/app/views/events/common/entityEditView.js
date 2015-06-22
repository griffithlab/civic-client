(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityEditViewController', EntityEditViewController)
    .directive('entityEditView', function() {
      return {
        restrict: 'E',
        scope: {
          viewModel: '=',
          revisionsModel: '=',
          viewOptions: '='
        },
        transclude: true,
        controller: 'EntityEditViewController',
        templateUrl: 'app/views/events/common/entityEditView.tpl.html'
      };
    });

  //@ngInject
  function EntityEditViewController($scope) {
    // entityViewModel and entityViewOptions are defined in [entity]ViewControllers, and passed to
    // this directive in [entity]View templates. This controller can then be required by child common components
    // to obtain references to view models and view options.
    this.viewModel = $scope.viewModel;
    this.revisionsModel = $scope.revisionsModel;
    this.viewOptions = $scope.viewOptions;
  }
})();
