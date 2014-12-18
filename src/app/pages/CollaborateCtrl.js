(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('CollaborateCtrl', CollaborateCtrl);

// @ngInject
  function CollaborateCtrl ($scope) {
    $scope.loadedMsg = 'Loaded Collaborate!';
  }
})();
