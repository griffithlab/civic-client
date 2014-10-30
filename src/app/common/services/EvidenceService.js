(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Evidence', EvidenceService);

  // @ngInject
  function EvidenceService($resource) {
    var Evidence = $resource('/api/genes/:geneId/variants/:variantId/evidence_items/:evidenceId',
      {},
      {
        query: { // query details for a single item of evidence
          method: 'GET',
          isArray: true
        },
        get: { // get a list of all evidence items
          method: 'GET',
          isArray: false
        }
      });

    return Evidence;
  }

})();