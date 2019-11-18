(function() {
  'use strict';

  angular.module('civic.services')
    .factory('DrugsResource', DrugsResource)
    .factory('Drugs', DrugsService);

  // @ngInject
  function DrugsResource($resource) {
    return $resource('/api/drugs', {}, {
      querySuggestions: {
        url: '/api/drugs/suggestions',
        method: 'GET',
        isArray: true,
        cache: false
      }
    });
  }

  // @ngInject
  function DrugsService(DrugsResource) {
    var cache = $cacheFactory.get('$http');
    // base Drug and Drug Colletion
    var item = {},
        collection = [],
        suggestions = [];


    return {
      data: {
        item: item,
        collection: collection,
        suggestions: suggestions
      },

      querySuggestions: querySuggestions,

    };
  };

  var querySuggestions = function(str) {
    var reqObj = {
      q: str
    };
    return DrugsResource.querySuggestions(reqObj).$promise
      .then(function(response) {
        angular.copy(response, suggestions);
        return response.$promise;
      });
  };
})();
