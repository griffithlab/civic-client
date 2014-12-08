(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Genes', GenesService);

  // @ngInject
  function GenesService($resource, _) {

    function transformTags (tags) {
      return _.map(tags, function(tag) {
        return { text: tag.name };
      });
    }

    var Genes = $resource('/api/genes/:geneId',
      { geneId: '@entrez_id' },
      {
        query: { // get a list of all genes
          method: 'GET',
          isArray: true,
          cache: true
        },
        queryNames: { // get a list of all gene names
          method: 'GET',
          isArray: true,
          /*jshint camelcase: false */
          transformResponse: function(data) {
            return _.uniq(_.map(JSON.parse(data), function(gene) {
              return { entrez_name: gene.entrez_name, entrez_id: gene.entrez_id };
            }));
          },
          cache: true
        },
        get: { // get a single gene
          method: 'GET',
          isArray: false,
          cache: true
        },
        update: {
          method: 'PUT'
        }
      });

    return Genes;
  }

})();
