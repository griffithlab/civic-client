(function() {
  'use strict';
  angular.module('civic.services')
    .factory('EventsResource', EventsResource)
    .factory('Events', EventsService);

  // @ngInject
  function EventsResource($resource) {

    return $resource('/api/events',
      {
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

    function query() {
      return EventsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
  }
})();
