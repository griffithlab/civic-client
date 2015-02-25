(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Glossary', GlossaryService);

  // @ngInject
  function GlossaryService($resource, $cacheFactory) {
    var cache = $cacheFactory('glossaryCache');

    var Glossary = $resource('/api/text/:term',
      {},
      {
        query: { // get a list of all glossary items
          method: 'GET',
          isArray: false,
          cache: cache
        },
        get: { // get a single glossary item
          method: 'GET',
          isArray: false,
          cache: cache
        }
      });

    return Glossary;
  }

})();
