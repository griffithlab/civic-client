(function() {
  angular.module('civic.services')
    .factory('GenesResource', GenesResource)
    .factory('Genes', GenesService);

  // @ngInject
  function GenesResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheResponseInterceptor = function(response) {
      console.log('cache removed within ResponseInterceptor', response.config.url);
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/genes/:geneId',
      {
        geneId: '@geneId'
      },
      {
        // Base Gene Resources
        query: {
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single gene
          method: 'GET',
          isArray: false,
          cache: cache
        },
        update: {
          method: 'PATCH',
          interceptor: {
            response: cacheResponseInterceptor
          }
        },
        delete: {
          method: 'DELETE',
          interceptor: {
            response: cacheResponseInterceptor
          },
          cache: false
        },
        apply: {
          method: 'PATCH'
        },

        // Gene Additional Info
        getMyGeneInfo: {
          url: '/api/genes/:geneId/mygene_info_proxy',
          params: {
            geneId: '@geneId'
          },
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
        },

        // Gene Collections
        queryVariants: {
          method: 'GET',
          url: '/api/genes/:geneId/variants',
          isArray: true,
          cache: cache
        },
        queryVariantGroups: {
          method: 'GET',
          url: '/api/genes/:geneId/variant_groups',
          isArray: true,
          cache: cache
        },

        // Base Gene Refresh
        queryFresh: { // get list of genes
          method: 'GET',
          isArray: true,
          cache: false
        },
        getFresh: { // get gene, force cache
          method: 'GET',
          isArray: false,
          cache: false
        },

        // Base Collections Refresh
        queryVariantsFresh: {
          method: 'GET',
          url: '/api/genes/:geneId/variants',
          isArray: true,
          cache: false
        },
        queryVariantGroupsFresh: {
          method: 'GET',
          url: '/api/genes/:geneId/variant_groups',
          isArray: true,
          cache: false
        },

        // Gene Comments Resources
        queryComments: {
          method: 'GET',
          url: '/api/genes/:geneId/comments',
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/genes/:geneId/comments/:commentId',
          params: {
            geneId: '@geneId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },

        submitComment: {
          method: 'POST',
          url: '/api/genes/:geneId/comments',
          params: {
            geneId: '@geneId'
          },
          cache: cache
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/genes/:geneId/comments/:commentId',
          params: {
            geneId: '@geneId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheResponseInterceptor
          }
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/genes/:geneId/comments/:commentId',
          params: {
            geneId: '@geneId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheResponseInterceptor
          }
        },

        // Gene Comments Refresh
        queryCommentsFresh: {
          method: 'GET',
          url: 'api/genes/:geneId/comments',
          isArray: true,
          cache: false
        },
        getCommentFresh: {
          method: 'GET',
          url: '/api/genes/:geneId/comments/:commentId',
          params: {
            geneId: '@geneId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: false
        }
      }
    )
  }

  // @ngInject
  function GenesService(GenesResource, $q, $exceptionHandler, $cacheFactory) {
    var cache = $cacheFactory.get('$http');
    // Base Gene and Gene Collection
    var item = {};
    var collection = [];

    // Additional Gene Data
    var myGeneInfo = {};

    // Gene Collections
    var variants = [];
    var variantGroups = [];
    var comment = {};
    var comments = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        myGeneInfo: myGeneInfo,
        variants: variants,
        variantGroups: variantGroups,
        comment: comment,
        comments: comments
      },

      // Gene Base
      query: query,
      get: get,
      update: update,
      delete: deleteItem,
      apply: apply,

      // Gene Additional Info
      getMyGeneInfo: getMyGeneInfo,

      // Gene Base Refresh
      queryFresh: queryFresh,
      getFresh: getFresh,

      // Gene Collections
      queryVariants: queryVariants,
      queryVariantGroups: queryVariantGroups,

      // Gene Collections Refresh
      queryVariantsFresh: queryVariantsFresh,
      queryVariantGroupsFresh: queryVariantGroupsFresh,

      // Gene Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      // Gene Comments Refresh
      queryCommentsFresh: queryCommentsFresh,
      getCommentFresh: getCommentFresh
    };

    function initBase(geneId) {
      return $q.all([
        get(geneId),
        getMyGeneInfo(geneId),
        queryVariants(geneId),
        queryVariantGroups(geneId)
      ])
    }

    function initComments(geneId) {
      return $q.all([
        queryComments(geneId)
      ])
    }
    // Gene Base
    function query() {
      return GenesResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function get(geneId) {
      return GenesResource.get({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function update(reqObj) {
      return GenesResource.update(reqObj).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function deleteItem(geneId) {
      return GenesResource.delete({geneId: geneId}).$promise
        .then(function(response) {
          item = null;
          return response.$promise;
        });
    }
    function apply(reqObj) {
      return GenesResource.apply(reqObj).$promise.then(
        function(response) { // success
          // remove gene's cache record
          cache.remove('/api/genes/' + response.id);
          get(reqObj.geneId);
          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        })
    }

    // Gene Additional Data
    function getMyGeneInfo(geneId) {
      return GenesResource.getMyGeneInfo({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, myGeneInfo);
          return response.$promise;
        });
    }

    // Gene Collections
    function queryVariants(geneId) {
      return GenesResource.queryVariants({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, variants);
          return response.$promise;
        });
    }
    function queryVariantGroups(geneId) {
      return GenesResource.queryVariantGroups({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, variantGroups);
          return response.$promise;
        });
    }
    // Gene Base Refresh
    function queryFresh(geneId) {
      return GenesResource.queryFresh({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function getFresh(geneId) {
      return GenesResource.getFresh({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    // Gene Collections Refresh
    function queryVariantsFresh(geneId) {
      return GenesResource.queryVariantsFresh({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, variants);
          return response.$promise;
        });
    }
    function queryVariantGroupsFresh(geneId) {
      return GenesResource.queryVariantGroupsFresh({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, variantGroups);
          return response.$promise;
        });
    }

    // Gene Comments
    function queryComments(geneId) {
      return GenesResource.queryComments({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(geneId, commentId) {
      return GenesResource.getComment({geneId: geneId, commentId: commentId}).$promise
        .then(function(response) {
          angular.copy(response, comment);
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      try {
        if(!_.has(reqObj, 'geneId')) {
          if(_.has(item, 'id')) { // check to see if we have a gene with an id
            _.merge(reqObj, { geneId: item.id });
          } else {
            throw new Error("No geneId supplied or found.");
          }
        }
      } catch(e) {
        $exceptionHandler(e.message, "GeneService:submitComment");
      }

      return GenesResource.submitComment(reqObj).$promise
        .then(function(response) {
          queryCommentsFresh(reqObj.geneId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return GenesResource.updateComment(reqObj).$promise
        .then(function(response) {
          angular.copy(response, comment);
          getCommentFresh(reqObj);
          return response.$promise;
        });
    }
    function deleteComment(geneId, commentId) {
      return GenesResource.deleteComment({geneId: geneId, commentId: commentId}).$promise
        .then(function(response) {
          comment = null;
          return response.$promise;
        });
    }

    // Gene Comments Refresh
    function queryCommentsFresh(geneId) {
      return GenesResource.queryCommentsFresh({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getCommentFresh(geneId, commentId) {
      return GenesResource.getCommentFresh({geneId: geneId, commentId: commentId}).$promise
        .then(function(response) {
          angular.copy(response   , comment);
          return response.$promise;
        });
    }
  }
})();
