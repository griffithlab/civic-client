(function() {
  'use strict';
  angular.module('civic.curation')
    .controller('EvidenceQueuesController', EvidenceQueuesController);


  // @ngInject
  function EvidenceQueuesController($scope,
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

    Sources.getSuggested({}).then(function(response) {
      vm.suggestedSources = response.result;
    });
  }
})();




// {"operator":"AND","queries":[{"field":"description","condition":{"name":"is_empty","parameters":[]}}],"entity":"variants","save":true}
