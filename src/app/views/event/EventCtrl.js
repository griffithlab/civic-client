(function() {
  'use strict';
  angular.module('civic.event')
    .controller('EventCtrl', EventCtrl);

  // @ngInject
  function EventCtrl($rootScope, $scope, $log, Variants) {
    $log.info('EventCtrl called.');
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Choose a Gene');

    $scope.variants = Variants.query();
  }
})();
