(function() {
  'use strict';
  angular.module('civic.curation')
    .controller('FlagsQueueController', FlagsQueueController);


  // @ngInject
  function FlagsQueueController($scope,
                                $state,
                                openFlags,
                                Sources) {
    var vm = $scope.vm = {};
    vm.openFlags = openFlags;

  }
})();
