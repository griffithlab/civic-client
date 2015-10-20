(function() {
  'use strict';
  angular.module('civic.activity')
    .controller('ActivityController', ActivityController);

  // @ngInject
  function ActivityController($scope, $log, uiGridConstants, Events) {
    var ctrl = $scope.ctrl = {};

    ctrl.events = [];

    Events.query()
      .then(function(events) {
        ctrl.events = events;
      });
  }
})();
