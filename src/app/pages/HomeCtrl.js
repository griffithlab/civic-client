(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HomeCtrl', HomeCtrl);

  // @ngInject
  function HomeCtrl($scope, Stats) {
    var vm = $scope.vm = {};
    vm.stats = {};
    Stats.get('site').then(function(stats) {
      vm.stats = stats;
    });
  }
})();
