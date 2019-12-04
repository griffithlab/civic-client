(function() {
  'use strict';

  angular.module('civic.services')
    .factory('DrugsResource', DrugsResource)
    .factory('Drugs', DrugsService);

  // @ngInject
  function DrugsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    return $resource('/api/drugs/:drugId', {}, {
      query: {
        method: 'GET',
        isArray: true,
        cache: cache
      },
      get: {
        method: 'GET',
        isArray: false,
        cache: cache
      },
      add: {
        method: 'POST',
        cache: false
      },
      querySuggestions: {
        url: '/api/drugs/suggestions',
        method: 'GET',
        isArray: true,
        cache: false
      }
    });
  }

  // @ngInject
  function DrugsService(DrugsResource, $cacheFactory) {
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
      query: query,
      get: get,
      add: add,
      querySuggestions: querySuggestions,

    };

    function query() {
      return DrugsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(drugId) {
      return DrugsResource.get({drugId: drugId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function add(newDrug) {
      return DrugsResource.add(newDrug).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function querySuggestions(str) {
      var reqObj = {
        q: str
      };
      return DrugsResource.querySuggestions(reqObj).$promise
        .then(function(response) {
          angular.copy(response, suggestions);
          return response.$promise;
        });
    };


  };

})();
