(function() {
  'use strict';

  angular.module('civic.services')
    .factory('DrugSuggestionsResource', DrugSuggestionsResource)
    .factory('DrugSuggestions', DrugSuggestionsService);

  // @ngInject
  function DrugSuggestionsResource($resource) {
    return $resource('/api/drugs/suggestions', {}, {
        query: {
          method: 'GET',
          isArray: true,
          cache: false
        },
        localQuery: {
          url: '/api/drugs/local_suggestions',
          method: 'GET',
          isArray: true
        }
      }
    );
  }

  // @ngInject
  function DrugSuggestionsService(DrugSuggestionsResource) {
    return {
      query: function(str) {
        var reqObj = {
          q: str
        };
        return DrugSuggestionsResource.query(reqObj).$promise
          .then(function(response) {
            return response.$promise;
          });
      },
      localQuery: function(str) {
        var reqObj = {
          q: str
        };
        return DrugSuggestionsResource.localQuery(reqObj).$promise
          .then(function(response) {
            return response.$promise;
          });
      }

    };
  }
})();
