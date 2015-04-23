(function() {
  'use strict';
  angular.module('civic.events')
    .directive('entityTalkRevisionSummary', entityTalkRevisionSummary)
    .controller('EntityTalkRevisionSummaryController', EntityTalkRevisionSummaryController);

  // @ngInject
  function entityTalkRevisionSummary() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        revisionData: '='
      },
      templateUrl: 'app/views/events/common/entityTalkRevisionSummary.tpl.html',
      controller: 'EntityTalkRevisionSummaryController'
    };
    return directive;
  }

  // @ngInject
  function EntityTalkRevisionSummaryController($scope) {
    var ctrl = $scope.ctrl = {};
    ctrl.revision = $scope.revisionData;
  }
})();
