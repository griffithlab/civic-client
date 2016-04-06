(function() {
  'use strict';
  angular.module('civic.services')
    .factory('CommentSuggestionsResource', CommentSuggestionsResource)
    .factory('CommentSuggestions', CommentSuggestionsService);

  // @ngInject
  function CommentSuggestionsResource($resource) {
    //var cache = $cacheFactory.get('$http');

    //var cacheInterceptor = function(response) {
    //  console.log(['EvidenceResource: removing', response.config.url, 'from $http cache.'].join(' '));
    //  cache.remove(response.config.url);
    //  return response.$promise;
    //};


    return $resource('/api/entity_suggestions',
      { },
      {
        getEntitySuggestions: {
          method: 'GET',
          url: '/api/entity_suggestions',
          isArray: true,
          cache: false
        },
        getUserSuggestions: {
          method: 'GET',
          url: '/api/users/suggestions',
          isArray: true,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function CommentSuggestionsService(CommentSuggestionsResource) {
    var userSuggestions = [];
    var entitySuggestions = [];

    return {
      data: {
        userSuggestions: userSuggestions,
        entitySuggestions: entitySuggestions
      },
      getUserSuggestions: getUserSuggestions,
      getEntitySuggestions: getEntitySuggestions
    };

    function getUserSuggestions(str) {
      return CommentSuggestionsResource.getUserSuggestions({username: str}).$promise
        .then(function(response) {
          angular.copy(response, userSuggestions);
          return response.$promise;
        });
    }
    function getEntitySuggestions(str) {
      return CommentSuggestionsResource.getEntitySuggestions({query: str}).$promise
        .then(function(response) {
          angular.copy(response, entitySuggestions);
          return response.$promise;
        });
    }
  }
})();
