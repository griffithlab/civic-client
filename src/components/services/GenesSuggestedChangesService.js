(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GenesSuggestedChanges', GenesSuggestedChangesService);

  // @ngInject
  function GenesSuggestedChangesService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesSuggestedChangesCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var Genes = $resource('/api/genes/:geneId/suggested_changes/:suggestedChangeId',
      { geneId: '@entrez_id',
        suggestedChangeId: '@id'},
      {
        query: { // get a list of all suggested changes
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single suggested change
          method: 'GET',
          isArray: false,
          cache: cache
        },
        add: {
          method: 'POST',
          interceptor: cacheInterceptor
        }
      });

    return Genes;
  }

})();
