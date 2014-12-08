(function() {
  'use strict';
  angular.module('civic.services')
    .factory('StateTitleService', StateTitleService);

  // @ngInject
  function StateTitleService($resource) {
    var Browse = $resource('/api/variants',
      {},
      {
        get: {
          method: 'GET',
          isArray: false
        },
        query: {
          method: 'GET',
          isArray: true
        }
      });

    return Browse;
  }

})();
