(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Genes', GenesService);

  // @ngInject
  function GenesService($resource, _) {

    function transformTags (tags) {
      return _.map(tags, function(tag) {
        return { text: tag.name }
      })
    }

    var Genes = $resource('http://mygene.info/v2/gene/:geneId',
      {geneId: '@entrez_id', callback:"JSON_CALLBACK"},
      {
        query: { // get a list of all genes
          method: 'JSONP',
          isArray: true
        },
        get: { // get a single gene
          method: 'JSONP',
          isArray: false,
          transformResponse: function(data){
            if(data.pathway){  
              if(!angular.isArray(data.pathway.pharmgkb) && data.pathway.pharmgkb){
                data.pathway.pharmgkb = [data.pathway.pharmgkb];
              }
            }
            if(!angular.isArray(data.alias) && data.alias){
              data.alias = [data.alias];
            }
            if(!angular.isArray(data.interpro) && data.interpro){
              data.interpro = [data.interpro];
            }
            return data;
          }
        }
      });

    return Genes;
  }

})();
