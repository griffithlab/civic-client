(function() {
  'use strict';
  angular.module('civic.services')
    .factory('OrganizationsResource', OrganizationsResource)
    .factory('Organizations', OrganizationsService);

  // @ngInject
  function OrganizationsResource($resource) {

    return $resource('/api/organizations', {
    }, {
      query: {
        method: 'GET',
        isArray: false,
        cache: true
      },
      get: {
        url:'/api/organizations/:organizationId',
        params: {organizationId: '@organizationId'},
        method: 'GET',
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
  function OrganizationsService(OrganizationsResource, UserOrgsInterceptor) {

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

    function interceptMembers(organization) {
      if(organization.members) {
        organization.members = organization.members.map(function(user) {
          var mock = {};
          mock.data = user;
          return UserOrgsInterceptor(mock);
        });
      }
      return organization;
    }

    function query(reqObj) {
      return OrganizationsResource.query(reqObj).$promise
        .then(function(response) {
          response.records = response.result.map(function(org) {
            return interceptMembers(org);
          });
          angular.copy(response.records, collection);
          return response.$promise;
        });
    }

    function get(organizationId) {
      return OrganizationsResource.get({
          organizationId: organizationId
        }).$promise
        .then(function(response) {
          response = interceptMembers(response);
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function queryEvidence(organizationId) {
      return OrganizationsResource.queryEvidence({
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
