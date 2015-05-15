(function() {
  'use strict';
  angular.module('civic.services')
    .factory('MyGeneInfoResource', MyGeneInfoResource)
    .factory('MyGeneInfo', MyGeneInfoService);

  // @ngInject
  function MyGeneInfoResource($resource, $cacheFactory, _) {

    var cache = $cacheFactory('MyGeneInfo'); // default cache doesn't work for some reason

    return $resource('/api/genes/mygene_info_proxy/:geneId',
      {
        geneId: '@geneId'
      },
      {
        get: {
          // isArray: false,
          cache: cache,
          transformResponse: function(data) {
            if(typeof data == 'string') {
              data = JSON.parse(data);
            }
            var srcMap = {
              kegg: 'http://www.genome.jp/kegg-bin/show_pathway?',
              reactome: 'http://www.reactome.org/cgi-bin/control_panel_st_id?ST_ID=',
              pharmgkb: 'https://www.pharmgkb.org/pathway/',
              humancyc: 'http://humancyc.org/HUMAN/NEW-IMAGE?type=PATHWAY&object=',
              smpdb: 'http://www.smpdb.ca/view/',
              pid: 'http://pid.nci.nih.gov/search/pathway_landing.shtml?what=graphic&jpg=on&pathway_id=',
              wikipathways: 'http://wikipathways.org/index.php/Pathway:',
              netpath: null,
              biocarta: null,
              inoh: null,
              signalink: null,
              ehmn: null
            };
            var pathways = data.pathway || [];
            var pathwaysFinal = [];
            var link;
            for(var src in pathways){
              if(!angular.isArray(pathways[src])){
                pathways[src] = [pathways[src]];
              }
              for(var p in pathways[src]){
                link = srcMap[src]+pathways[src][p].id;
                if(srcMap[src] === null){
                  link = null;
                }
                pathwaysFinal.push({
                  name: pathways[src][p].name,
                  link: link,
                  src: src
                });
              }
            }
            data.pathway = pathwaysFinal;
            if(!_.isArray(data.alias) && data.alias){
              data.alias = [data.alias];
            }
            if(!_.isArray(data.interpro) && data.interpro){
              data.interpro = [data.interpro];
            }
            return data;
          }
        }

      });
  }

  // @ngInject
  function MyGeneInfoService(MyGeneInfoResource) {
    return {
      get: function(entrez_id) {
        return MyGeneInfoResource.get({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
        });
      }
    }
  }
})();
