(function() {
  'use strict';
  angular.module('civic.users.profile')
    .controller('ProfileController', ProfileController);

  // @ngInject
  function ProfileController($scope, Search, user, events) {
    var vm = $scope.vm = {};

    vm.user = user;
    vm.events = events.result;

    var query = {
      'entity': 'evidence_items',
      'operator':'AND',
      'save': false,
      'queries': [
        {
          'field':'submitter_id',
          'condition': {
            'name':'is_equal_to',
            'parameters':[user.id]
          }
        }
      ]};

    Search.post(query).then(
      function(response) {
        vm.evidence = response.results;
      },
      function() {
        console.log('User has no events events associated with their profile.');
      });
  }
})();
