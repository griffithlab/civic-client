(function() {
  'use strict';

  angular.module('civic.services')
    .factory('DrugSuggestionsResource', DrugSuggestionsResource)
    .factory('DrugSuggestions', DrugSuggestionsService);

  // @ngInject
  function DrugSuggestionsResource($resource) {
    return $resource('/api/drugs/suggestions',
      {},
      {
        query: {
          method: 'GET',
          isArray: true,
          cache: false
        }
      }
    )
  }

  // @ngInject
  function DrugSuggestionsService(DrugSuggestionsResource) {
    return {
      query: function(str) {
        var reqObj = { q: str };
        return DrugSuggestionsResource.query(reqObj).$promise
          .then(function(response) {
            return response.$promise;
          })
      }
    }
  }
})();
