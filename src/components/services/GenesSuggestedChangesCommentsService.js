(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GenesSuggestedChangesComments', GenesSuggestedChangesCommentsService);

  // @ngInject
  function GenesSuggestedChangesCommentsService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesSuggestedChangesCommentsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var Genes = $resource('/api/genes/:geneId/suggested_changes/:suggestedChangeId/comments/:commentId',
      { geneId: '@entrez_id',
        suggestedChangeId: '@suggestedChangeId',
        commentId: '@id'
      },
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
