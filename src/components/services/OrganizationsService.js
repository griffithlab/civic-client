(function() {
  'use strict';
  angular.module('civic.services')
    .factory('OrganizationsResource', OrganizationsResource)
    .factory('Organizations', OrganizationsService);

  // @ngInject
  function OrganizationsResource($resource) {

    return $resource('/api/organizations',
                     {},
                     {
                       query: {
                         method: 'GET',
                         isArray: true,
                         cache: true
                       },
                       get: {
                         method: 'GET',
                         url: '/api/organizations/:organizationId',
                         isArray: false,
                         cache: true
                       }
                     });
  }

  // @ngInject
  function OrganizationsService(OrganizationsResource) {

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
      return OrganizationsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(organizationId) {
      return OrganizationsResource.get({organizationId: organizationId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
  }

})();
