(function() {
  'use strict';
  angular.module('civic.curation')
    .controller('SourcesQueueController', SourcesQueueController);


  // @ngInject
  function SourcesQueueController($scope,
                                  $state,
                                  Sources
  ) {
    var vm = $scope.vm = {};
    vm.suggestedSources = [];

    vm.viewPublication = function(id) {
      var params = {
        sourceId: id
      };

      $state.go('sources.summary', params);
    };

    Sources.getSuggested({count: 999}).then(function(response) {
      vm.suggestedSources = response.result;
    });

    $scope.$on('suggestion:updated', function() {
      Sources.getSuggested({count: 999}).then(function(response) {
        vm.suggestedSources = response.result;
      });
    });
  }
})();
