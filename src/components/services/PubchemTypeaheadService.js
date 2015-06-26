(function() {
  'use strict';
  angular.module('civic.services')
    .factory('PubchemTypeaheadResource', PubchemTypeaheadResource)
    .factory('PubchemTypeahead', PubchemTypeaheadService);

  /*
   * This resource uses the Pubchem autocomplete service, as documented here:
   * https://pubchem.ncbi.nlm.nih.gov/widget/docs/widget_autocomplete_help.html#pc_compoundnames
   */

  // @ngInject
  function PubchemTypeaheadResource($resource) {
    return $resource('https://pubchem.ncbi.nlm.nih.gov/pcautocp/pcautocp.cgi',
      {
        dict: 'pc_compoundnames',
        n: '20'
      },
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: true
        }
      }
    );
  }

  // @ngInject
  function PubchemTypeaheadService(PubchemTypeaheadResource) {
    var collection = [];

    return {
      data: {
        collection: collection
      },
      get: get
    };

    function get(query) {
      return PubchemTypeaheadResource.get({q: query}).$promise
        .then(function(response) {
          angular.copy(response.autocp_array, collection);
          return response.$promise;
        });
    }
  }
})();
