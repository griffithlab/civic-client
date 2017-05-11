(function() {
  'use strict';
  angular.module('civic.services')
    .factory('EventsResource', EventsResource)
    .factory('Events', EventsService);

  // @ngInject
  function EventsResource($resource) {

    return $resource('/api/events',
      {
        count: '@count',
        page: '@page'
      },
      {
        querySiteEvents: {
          method: 'GET',
          isArray: false,
          cache: false
        },
        queryUserEvents: {
          url: '/api/users/:id/events',
          params: {
            id: '@id'
          },
          method: 'GET',
          isArray: false,
          cache: false
        },
        queryOrganizationEvents: {
          url: '/api/organizations/:id/events',
          params: {
            id: '@id'
          },
          method: 'GET',
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function EventsService(EventsResource) {
    var collection = [];

    return {
      data: {
        collection: collection
      },
      query: query,
      queryOrganizationEvents: queryOrganizationEvents,
      queryUserEvents: queryUserEvents
    };

    function query(reqObj) {
      return EventsResource.querySiteEvents(reqObj).$promise
        .then(function(response) {
          angular.copy(response.result, collection);
          return response.$promise;
        });
    }

    function queryUserEvents(reqObj) {
      return EventsResource.queryUserEvents(reqObj).$promise
        .then(function(response) {
          angular.copy(response.result, collection);
          return response.$promise;
        });
    }

    function queryOrganizationEvents(reqObj) {
      return EventsResource.queryOrganizationEvents(reqObj).$promise
        .then(function(response) {
          angular.copy(response.records, collection);
          return response.$promise;
        });
    }
  }
})();
