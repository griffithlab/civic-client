(function() {
  'use strict';
  angular.module('civic.services')
    .factory('NccnGuidelinesResource', NccnGuidelinesResource)
    .factory('NccnGuidelines', NccnGuidelinesService);

  // @ngInject
  function NccnGuidelinesResource($resource) {
    return $resource('/api/nccn_guidelines',
      {},
      {
        contains: {
          method: 'GET',
          url: '/api/nccn_guidelines?query=:query',
          isArray: true,
          cache: true
        },
        exactMatch: {
          method: 'GET',
          url: '/api/nccn_guidelines?query=:query&exact_match=true',
          isArray: true,
          cache: true
        }
      }
    );
  }

  // @ngInject
  function NccnGuidelinesService(NccnGuidelinesResource) {
    var item = {};
    var collection = [];

    return {
      data: {
        item: item,
        collection: collection
      },
      contains: contains,
      exactMatch: exactMatch
    };

    function contains(query) {
      return NccnGuidelinesResource.contains({query: query}).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
    function exactMatch(query) {
      return NccnGuidelinesResource.exactMatch({query: query}).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
  }
})();
