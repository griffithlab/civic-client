(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Genes', GenesService);

  // @ngInject
  function GenesService($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesCache');

    var interceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        $log.info('cache removed', response.config.url);
        return response;
      }
    };

    var Genes = $resource('/api/genes/:geneId',
      { geneId: '@entrez_id' },
      {
        query: { // get a list of all genes
          method: 'GET',
          isArray: true,
          cache: cache
        },
        queryNames: { // get a list of all gene names
          method: 'GET',
          isArray: true,
          /*jshint camelcase: false */
          transformResponse: function(data) {
            return _.uniq(_.map(JSON.parse(data), function(gene) {
              return { entrez_name: gene.entrez_name, entrez_id: gene.entrez_id };
            }));
          },
          cache: cache
        },
        get: { // get a single gene
          method: 'GET',
          isArray: false,
          cache: cache
        },
        update: {
          method: 'PUT',
          interceptor: interceptor
        }
      });

    return Genes;
  }

})();
