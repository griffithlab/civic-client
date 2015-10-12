(function() {
  'use strict';
  angular.module('civic.search')
    .controller('SearchController', SearchController);

  // @ngInject
  function SearchController($scope, $log) {
    var ctrl = $scope.ctrl = {};
    $log.debug('SearchController called.');
  }
})();
