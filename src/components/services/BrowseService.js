(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Browse', BrowseService);

  // @ngInject
  function BrowseService($resource) {
    var Browse = $resource('/api/datatables/variants',
      {},
      {
        get: {
          method: 'GET',
          isArray: false,
          transformResponse: function(data) {
            var events = JSON.parse(data);
            events.result = _.map(events.result, function (event) {
              event.diseases = event.diseases.join(', ');
              return event;
            });
            return events;
          }
        },
        query: {
          method: 'GET',
          isArray: true
        }
      });

    return Browse;
  }

})();
