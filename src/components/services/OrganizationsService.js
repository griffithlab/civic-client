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
                       },
                       queryEvidence: {
                         method: 'GET',
                         url: '/api/organizations/:organizationId/evidence_items',
                         isArray: false,
                         cache: false
                       }
                     });
  }

  // @ngInject
  function OrganizationsService(OrganizationsResource) {

    var item = {};
    var collection = [];
    var evidence_items = [];

    return {
      data: {
        item: item,
        collection: collection,
        evidence_items: evidence_items
      },
      query: query,
      get: get,
      queryEvidence: queryEvidence
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

    function queryEvidence(organizationId) {
      return OrganizationsResource.queryEvidence(
        {
          organizationId: organizationId,
          count: 999
        }).$promise
        .then(function(response) {
          angular.copy(response.records, evidence_items);
          return response.$promise;
        });
    }
  }

})();
