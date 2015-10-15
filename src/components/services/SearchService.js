(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Search',SearchService);

  // @ngInject
  function SearchService($resource) {
    var SearchService = $resource('/api/evidence_items/search',
      {},
      {
        post: {
          method: 'POST',
          isArray: true,
          cache: false
        }
      });

    return SearchService;
  }

})();
