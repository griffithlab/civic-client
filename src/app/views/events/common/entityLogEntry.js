(function() {
  'use strict';
  angular.module('civic.events.common')
    .directive('entityLogEntry', entityLogEntryDirective)
    .controller('EntityLogEntryController', EntityLogEntryController);

  // @ngInject
  function entityLogEntryDirective() {
    return {
      restrict: 'E',
      scope: {
        entryData: '='
      },
      controller: 'EntityLogEntryController',
      templateUrl: 'app/views/events/common/entityLogEntry.tpl.html'
    };
  }

  // @ngInject
  function EntityLogEntryController($scope) {
    var ctrl = $scope.ctrl = {};
    ctrl.entry = $scope.entryData;
    ctrl.user = ctrl.entry.user;

    if (typeof ctrl.user === 'string') {
      ctrl.username = ctrl.user;
    } else {
      ctrl.username = ctrl.user.username;
    }
  }
})();
