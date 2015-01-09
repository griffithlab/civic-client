(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GeneComments', GeneCommentsService);

    // @ngInject
  function GeneCommentsService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesCommentsCache');

    var cacheInterceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        return response;
      }
    };

    var Genes = $resource('/api/genes/:geneId/comments/:commentId',
      { geneId: '@entrez_id',
        commentId: '@id'
      },
      {
        query: { // get a list of all gene comments
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single comment
          method: 'GET',
          isArray: false,
          cache: cache
        },
        add: { // add a comment
          method: 'POST',
          interceptor: cacheInterceptor
        }
      });

    return Genes;
  }

})();
