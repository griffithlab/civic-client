(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroups', VariantGroupsService);

  // @ngInject
  function VariantGroupsService($resource) {
    var VariantGroups= $resource('/api/variant_groups/:variantGroupId',
      {},
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: true
        },
        query: {
          method: 'GET',
          isArray: true,
          cache: true
        }
      });

    return VariantGroups;
  }

})();
