(function() {
  'use strict';
  angular.module('civic.services')
    .factory('FlagsResource', FlagsResource)
    .factory('Flags', FlagsService);

  // @ngInject
  function FlagsResource($resource) {
    return $resource(
      '/api/curation/open_flags',
      {},
      {
        queryOpen: {
          method: 'GET',
          isArray: false,
          cache: true
        }
      });
  }

  // @ngInject
  function FlagsService(FlagsResource) {
    var collection = [];

    return {
      data: {
        collection: collection
      },
      queryOpen: queryOpen
    };

    function queryOpen() {
      return FlagsResource.queryOpen().$promise
        .then(function(response) {
          angular.copy(response.records, collection);
          return response.$promise;
        });
    }
  }
})();
