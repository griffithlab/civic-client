(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Genes', GenesService);

  // @ngInject
  function GenesService($resource) {
    var Genes = $resource('/api/genes/:geneId',
      {},
      {
        query: {
          method: 'GET',
          isArray: false
        }
      });

    return Genes;
  }

})();