(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HomeCtrl', HomeCtrl);

  /**
   * @ngInject
   */
  function HomeCtrl($rootScope, $scope, $log) {
    $log.info('HomeCtrl instantiated');
    $rootScope.navMode = 'home';
    $rootScope.viewTitle = 'Home';
    $scope.loadedMsg = 'Loaded Home!';
  }
})();