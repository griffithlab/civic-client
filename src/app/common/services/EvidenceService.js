(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Evidence', EvidenceService);

  // @ngInject
  function EvidenceService($resource) {
    var Evidence = {};
    Evidence.get = function(itemParams) {
      return {
        "id": itemParams.evidenceId,
        "explanation": "treatment with immunotherapy (e.g. Ipilimumab) prior to RAF inhibitor (e.g. Debrafenib) appears to be beneficial, and better than vice versa.",
        "disease": "Melanoma",
        "source": "24577748",
        "drug": "Ipilimumab, Debrafenib",
        "rating": 0,
        "evidence_level": "B",
        "evidence_type": "Prognostic",
        "outcome": "",
        "clinical_direction": ""
      }
    };
//    var Evidence = $resource('/api/evidence/:evidenceId',
//      {},
//      {
//        query: { // query details for a single item of evidence
//          method: 'GET',
//          isArray: true
//        },
//        get: { // get a list of all evidence items
//          method: 'GET',
//          isArray: false
//        }
//      });

    return Evidence;
  }

})();