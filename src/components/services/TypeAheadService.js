(function() {
  'use strict';
  angular.module('civic.services')
    .factory('TypeAheadResults', TypeAheadResultsService);

  // @ngInject
  function TypeAheadResultsService($resource, $cacheFactory) {
    var TypeAheadResults = $resource('/api/variants/typeahead_results',
      {
        query: '@query'
      },
      {
        query: { // get matching variants
          method: 'GET',
          isArray: false,
          cache: true
        }
      });

    return TypeAheadResults;
  }

})();
