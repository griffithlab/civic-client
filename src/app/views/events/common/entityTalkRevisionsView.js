(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkRevisionsViewController', EntityTalkRevisionsViewController)
    .directive('entityTalkRevisionsView', function() {
      return {
        restrict: 'E',
        scope: {
          viewModel: '=',
          viewOptions: '='
        },
        transclude: true,
        controller: 'EntityTalkRevisionsViewController',
        templateUrl: 'app/views/events/common/entityTalkRevisionsView.tpl.html'
      };
    });

  //@ngInject
  function EntityTalkRevisionsViewController($scope) {
    // entityTalkRevisionsViewModel and entityTalkRevisionsViewOptions are defined in [entity]ViewControllers, and passed to
    // this directive in [entity]View templates. This controller can then be required by child common components
    // to obtain references to view models and view options.
    this.entityTalkRevisionsViewModel = $scope.viewModel;
    this.entityTalkRevisionsViewOptions= $scope.viewOptions;
  }

})();
