(function() {
  'use strict';
  angular.module('civic.common')
    .directive('statsBlock', statsBlock)
    .controller('StatsBlockController', StatsBlockController);

  // @ngInject
  function statsBlock() {
    return {
      restrict: 'E',
      scope: {
        stats: '=',
        title: '@',
        iconUrl: '@',
        cols: '@'
      },
      templateUrl: 'components/directives/statsBlock.tpl.html',
      controller: 'StatsBlockController'
    };
  }

  // @ngInject
  function StatsBlockController($scope) {
    var vm = $scope.vm = {};

    vm.stats = $scope.stats;
    vm.title = $scope.title;
    vm.icon = $scope.icon;
    vm.cols = $scope.cols;

    $scope.$watchCollection('stats', function(stats) {
      vm.stats = stats;
    });
  }
})();
