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
        query: {
          method: 'GET',
          isArray: true,
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
      query: query
    };

    function query(reqObj) {
      return EventsResource.query(reqObj).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
  }
})();
