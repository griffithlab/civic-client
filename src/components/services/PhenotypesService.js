(function() {
  'use strict';

  angular.module('civic.services')
    .factory('PhenotypesResource', PhenotypesResource)
    .factory('Phenotypes', PhenotypesService);

  // @ngInject
  function PhenotypesResource($resource) {
    return $resource('/api/phenotypes', {}, {
        query: {
          method: 'GET',
          isArray: true,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function PhenotypesService(PhenotypesResource) {
    return {
      query: function(str) {
        var reqObj = {
          query: str,
          count: 25
        };
        return PhenotypesResource.query(reqObj).$promise
          .then(function(response) {
            return response.$promise;
          });
      }
    };
  }
})();
