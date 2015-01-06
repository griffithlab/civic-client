(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Evidence', EvidenceService);

  // @ngInject
  function EvidenceService($resource, $cacheFactory) {
    var cache = $cacheFactory('evidenceCache');

    var interceptor = {
      response: function(response) {
        cache.remove(response.config.url);
        $log.info('cache removed', response.config.url);
        return response;
      }
    };

    var Evidence = $resource('/api/genes/:geneId/variants/:variantId/evidence_items/:evidenceId',
      { geneId: '@entrez_id', variantId: '@variant_id', evidenceId: '@id' },
      {
        query: { // query details for a single item of evidence
          method: 'GET',
          isArray: true
        },
        get: { // get a list of all evidence items
          method: 'GET',
          isArray: false
        },
        update: {
          method: 'PUT',
          interceptor: interceptor
        }
      });

    return Evidence;
  }

})();
