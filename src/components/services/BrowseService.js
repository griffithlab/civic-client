(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Browse', BrowseService);

  // @ngInject
  function BrowseService($resource) {
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
