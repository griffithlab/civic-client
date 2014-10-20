(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('CollaborateCtrl', CollaborateCtrl);

// @ngInject
  function CollaborateCtrl ($scope, $rootScope, $log) {
    $log.info('CollaborateCtrl loaded.');
    $rootScope.setNavMode('sub');
    $rootScope.setTitle('Collaborate');

    $scope.loadedMsg = 'Loaded Collaborate!';
  }
})();