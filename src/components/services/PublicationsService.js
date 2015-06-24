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
          cache: false
        },
        get: {
          method: 'GET',
          url: '/api/sources/existence/:pubmedId',
          isArray: false,
          cache: false
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
      get: get
    };

    function query() {
      return PublicationsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(publicationId) {
      return PublicationsResource.get({publicationId: publicationId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function validate(publicationId) {
      return PublicationsResource.get({publicationId: publicationId}).$promise
        .then(function (response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
  }
})();
