(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Variants', VariantsService);

  // @ngInject
  function VariantsService($resource) {
    var Variants = $resource('/api/variants',
      {},
      {
        query: {
          method: 'GET',
          isArray: false
        }
      });

    return Variants;
  }

})();
