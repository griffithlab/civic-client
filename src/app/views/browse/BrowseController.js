(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseController', BrowseController);

// @ngInject
  function BrowseController($scope, uiGridConstants, $state, $stateParams, Datatables, _, $log) {
    var ctrl = $scope.ctrl = {};
    ctrl.mode = 'variants';
  }
})();
