(function() {
  'use strict';
  angular.module('civic.services')
    .factory('TypeAheadResults', TypeAheadResultsService);

  // @ngInject
  function TypeAheadResultsService($resource) {
    var TypeAheadResults = $resource('/api/variants/typeahead_results',
      {
        query: '@query',
        limit: '@limit'
      },
      {
        query: { // get matching variants
          method: 'GET',
          isArray: false,
          cache: true
        },
        variants: {
          url: '/api/typeahead_searches/variants',
          method: 'GET',
          params: {
            query: '@query',
            count: '@count'
          },
          isArray: false,
          cache: true
        }
      });

    return TypeAheadResults;
  }

})();
