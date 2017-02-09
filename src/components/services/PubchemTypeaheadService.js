(function() {
  'use strict';
  angular.module('civic.services')
    .factory('PubchemTypeaheadResource', PubchemTypeaheadResource)
    .factory('PubchemTypeahead', PubchemTypeaheadService);


  // @ngInject
  function PubchemTypeaheadResource($resource) {
    return $resource('/api/drugs/suggestions',
      {},
      {
        get: {
          method: 'GET',
          isArray: true,
          cache: true
        }
      }
    );
  }

  // @ngInject
  function PubchemTypeaheadService(PubchemTypeaheadResource) {
    var collection = [];

    return {
      data: {
        collection: collection
      },
      get: get
    };

    function get(query) {
      return PubchemTypeaheadResource.get({q: query}).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
  }
})();
