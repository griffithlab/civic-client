(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseController', BrowseController);

// @ngInject
  function BrowseController($scope, $log, mode) {
    var ctrl = $scope.ctrl = {};
    ctrl.mode = mode;
  }
})();
