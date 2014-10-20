(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HomeCtrl', HomeCtrl);

  /**
   * @ngInject
   */
  function HomeCtrl($rootScope, $scope, $log) {
    $log.info('HomeCtrl instantiated');
    $rootScope.setTitle('Home');
    $rootScope.setNavMode('home');
  }
})();