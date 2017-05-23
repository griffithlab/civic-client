(function() {
  'use strict';
  angular.module('civic.curation')
    .controller('FlagsQueueController', FlagsQueueController);


  // @ngInject
  function FlagsQueueController($scope,
                                $state,
                                openFlags) {
    var vm = $scope.vm = {};
    vm.openFlags = openFlags;
  }
})();
