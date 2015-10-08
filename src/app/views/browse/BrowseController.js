(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseController', BrowseController);

  // @ngInject
  function BrowseController($scope, $log, mode, page) {
    var ctrl = $scope.ctrl = {};
    ctrl.mode = mode;
    ctrl.page = page;
  }
})();
