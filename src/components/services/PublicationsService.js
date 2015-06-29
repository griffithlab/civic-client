(function() {
  'use strict';
  angular.module('civic.services')
    .factory('PublicationsResource', PublicationsResource)
    .factory('Publications', PublicationsService);

  // @ngInject
  function PublicationsResource($resource) {
    return $resource('/api/sources',
      {},
      {
        query: {
          method: 'GET',
          isArray: true,
          cache: true
        },
        get: {
          method: 'GET',
          url: '/api/sources/existence/:pubmedId',
          isArray: false,
          cache: true
        },
        verify: {
          method: 'GET',
          url: '/api/sources/existence/:pubmedId',
          isArray: false,
          cache: true
        }
      }
    );
  }

  // @ngInject
  function PublicationsService(PublicationsResource) {
    var item = {};
    var collection = [];

    return {
      data: {
        item: item,
        collection: collection
      },
      query: query,
      get: get,
      verify: verify
    };

    function query() {
      return PublicationsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(pubmedId) {
      return PublicationsResource.get({pubmedId: pubmedId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function verify(pubmedId) {
      return PublicationsResource.verify({pubmedId: pubmedId}).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
  }
})();
