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
            var src_map = {
              kegg: "http://www.genome.jp/kegg-bin/show_pathway?",
              reactome: "http://www.reactome.org/cgi-bin/control_panel_st_id?ST_ID=",
              pharmgkb: "https://www.pharmgkb.org/pathway/",
              humancyc: "http://humancyc.org/HUMAN/NEW-IMAGE?type=PATHWAY&object=",
              smpdb: "http://www.smpdb.ca/view/",
              pid: "http://pid.nci.nih.gov/search/pathway_landing.shtml?what=graphic&jpg=on&pathway_id=",
              wikipathways: "http://wikipathways.org/index.php/Pathway:",
              netpath: null,
              biocarta: null,
              inoh: null,
              signalink: null,
              ehmn: null              
            };
            var pathways = data.pathway || [];
            var pathways_final = [];
            var link;
            for(var src in pathways){
              if(!angular.isArray(pathways[src])){
                pathways[src] = [pathways[src]];
              }
                for(var p in pathways[src]){
                  link = src_map[src]+pathways[src][p].id;
                  if(src_map[src] == null){
                    link = null;
                  }
                  pathways_final.push({
                    name: pathways[src][p].name,
                    link: link,
                    src: src
                  });
                }
              }
            data.pathway = pathways_final;
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
