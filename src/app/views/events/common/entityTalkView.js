(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkViewController', EntityTalkViewController)
    .directive('entityTalkView', function() {
      return {
        restrict: 'E',
        scope: {
          viewModel: '=',
          revisionsModel: '=',
          viewOptions: '='
        },
        transclude: true,
        controller: 'EntityTalkViewController',
        templateUrl: 'app/views/events/common/entityTalkView.tpl.html'
      };
    });

  //@ngInject
  function EntityTalkViewController($scope) {
    // entityViewModel and entityViewOptions are defined in [entity]ViewControllers, and passed to
    // this directive in [entity]View templates. This controller can then be required by child common components
    // to obtain references to view models and view options.
    this.viewModel = $scope.viewModel;
    this.revisionsModel = $scope.revisionsModel;
    this.viewOptions = $scope.viewOptions;
  }
})();
