(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GenesResource', GenesResource)
    .factory('Genes', GenesService);

  // @ngInject
  function GenesResource($resource, $cacheFactory, _) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      // console.log(['GenesResource: removing', response.config.url, 'from $http cache.'].join(' '));
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/genes/:geneId', {
      geneId: '@geneId'
    }, {
      // Base Gene Resources
      query: {
        method: 'GET',
        isArray: false,
        cache: cache
      },
      get: { // get a single gene
        method: 'GET',
        isArray: false,
        cache: cache
      },
      getName: { // get a single gene's name and entrez_id
        url: '/api/genes/:geneId',
        params: {
          detailed: 'false'
        },
        method: 'GET',
        isArray: false,
        cache: cache
      },
      update: {
        method: 'PATCH',
        interceptor: {
          response: cacheInterceptor
        }
      },
      delete: {
        method: 'DELETE',
        interceptor: {
          response: cacheInterceptor
        }
      },
      apply: {
        method: 'PATCH',
        cache: false
      },
      verify: {
        method: 'GET',
        url: '/api/genes/existence/:geneId',
        isArray: false,
        cache: cache
      },
      search: {

      },
      beginsWith: {
        method: 'GET',
        url: '/api/genes?name=:name&detailed=false',
        isArray: true,
        cache: cache
      },

      // Gene Additional Info
      getMyGeneInfo: {
        url: '/api/genes/:geneId/mygene_info_proxy',
        params: {
          geneId: '@geneId'
        },
        cache: cache,
        transformResponse: function(data) {
          if (typeof data === 'string') {
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
          for (var src in pathways) {
            if (!angular.isArray(pathways[src])) {
              pathways[src] = [pathways[src]];
            }
            for (var p in pathways[src]) {
              link = srcMap[src] + pathways[src][p].id;
              if (srcMap[src] === null) {
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
          if (!_.isArray(data.alias) && data.alias) {
            data.alias = [data.alias];
          }
          if (!_.isArray(data.interpro) && data.interpro) {
            data.interpro = [data.interpro];
          }
          return data;
        }
      },
      getVariantsStatus: {
        url: '/api/genes/:geneId/variants_status',
        method: 'GET',
        isArray: false,
        cache: cache
      },
      // Gene Collections
      queryVariants: {
        method: 'GET',
        url: '/api/genes/:geneId/variants',
        isArray: false,
        cache: cache
      },
      queryVariantGroups: {
        method: 'GET',
        url: '/api/genes/:geneId/variant_groups',
        isArray: false,
        cache: cache
      },
      queryFlags: {
        method: 'GET',
        url: '/api/genes/:geneId/flags',
        isArray: false,
        cache: cache
      },
      submitFlag: {
        method: 'POST',
        url: '/api/genes/:geneId/flags',
        cache: false
      },
      resolveFlag: {
        method: 'PATCH',
        url: '/api/genes/:geneId/flags/:flagId',
        params: {
          geneId: '@geneId',
          flagId: '@flagId'
        },
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
        cache: false
      },
      updateComment: {
        method: 'PATCH',
        url: '/api/genes/:geneId/comments/:commentId',
        params: {
          geneId: '@geneId',
          commentId: '@commentId'
        },
        cache: false
      },
      deleteComment: {
        method: 'DELETE',
        url: '/api/genes/:geneId/comments/:commentId',
        params: {
          geneId: '@geneId',
          commentId: '@commentId'
        },
        cache: false
      }
    });
  }

  // @ngInject
  function GenesService(GenesResource, Subscriptions, $q, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // Base Gene and Gene Collection
    var item = {};
    var collection = [];

    // Additional Gene Data
    var myGeneInfo = {};
    var variantsStatus = [];

    // Gene Collections
    var variants = [];
    var variantGroups = [];
    var comments = [];
    var flags = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        myGeneInfo: myGeneInfo,
        variants: variants,
        variantGroups: variantGroups,
        variantsStatus: variantsStatus,
        comments: comments,
        flags: flags
      },

      // Gene Base
      query: query,
      get: get,
      getName: getName,
      update: update,
      delete: deleteItem,
      apply: apply,

      // Gene Additional Info
      getMyGeneInfo: getMyGeneInfo,
      getVariantsStatus: getVariantsStatus,

      // Verify
      verify: verify,

      // Gene Collections
      queryVariants: queryVariants,
      queryVariantGroups: queryVariantGroups,
      queryFlags: queryFlags,
      submitFlag: submitFlag,
      resolveFlag: resolveFlag,

      // Gene Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      // Misc
      beginsWith: beginsWith
    };

    function mapVariantStatuses(variants, statuses) {
      return _.map(variants, function(variant) {
        variant.statuses = _.chain(statuses)
          .find({
            id: variant.id
          })
          .pick(['has_pending_fields', 'has_pending_evidence'])
          .value();
        return variant;
      });
    }

    function initBase(geneId) {
      return $q.all([
        get(geneId),
        getMyGeneInfo(geneId),
        getVariantsStatus(geneId),
        queryFlags(geneId)
      ]);
    }

    function initComments(geneId) {
      return $q.all([
        queryComments(geneId)
      ]);
    }

    // Gene Base
    function query() {
      return GenesResource.query().$promise
        .then(function(response) {
          angular.copy(response.records, collection);
          return response.$promise;
        });
    }

    function get(geneId) {
      return GenesResource.get({
        geneId: geneId
      }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function getName(geneId) {
      return GenesResource.getName({
        geneId: geneId
      }).$promise
        .then(function(response) {
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
      return GenesResource.delete({
        geneId: geneId
      }).$promise
        .then(function(response) {
          item = null;
          return response.$promise;
        });
    }

    function apply(reqObj) {
      return GenesResource.apply(reqObj).$promise.then(
        function(response) { // success
          cache.remove('/api/genes/' + response.id);
          get(reqObj.geneId);
          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        });
    }

    function verify(geneId) {
      return GenesResource.verify({
        geneId: geneId
      }).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function beginsWith(name) {
      return GenesResource.beginsWith({
        name: name
      }).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    // Gene Additional Data
    function getMyGeneInfo(geneId) {
      return GenesResource.getMyGeneInfo({
        geneId: geneId
      }).$promise
        .then(function(response) {
          angular.copy(response, myGeneInfo);
          return response.$promise;
        });
    }

    // Gene Collections
    function queryVariants(geneId) {
      return GenesResource.queryVariants({
        geneId: geneId,
        count: 999
      }).$promise
        .then(function(response) {
          angular.copy(response.records, variants);
          return response.$promise;
        });
    }

    function queryVariantGroups(geneId) {
      return GenesResource.queryVariantGroups({
        geneId: geneId
      }).$promise
        .then(function(response) {
          angular.copy(response.records, variantGroups);
          return response.$promise;
        });
    }

    function getVariantsStatus(geneId) {
      return GenesResource.getVariantsStatus({geneId: geneId})
        .$promise
        .then(function(response) {
          angular.copy(response, variantsStatus);
          return response.$promise;
        });
    }

    function queryFlags(geneId) {
      return GenesResource.queryFlags({geneId: geneId}).$promise
        .then(function(response) {
          angular.copy(response.records, flags);
          return response.$promise;
        });
    }

    function submitFlag(reqObj) {
      reqObj.geneId = reqObj.entityId;
      return GenesResource.submitFlag(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/genes/' + reqObj.geneId + '/flags');
          queryFlags(reqObj.geneId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }
    function resolveFlag(reqObj) {
      reqObj.geneId = reqObj.entityId;
      reqObj.state = 'resolved';
      return GenesResource.resolveFlag(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/genes/' + reqObj.geneId + '/flags');
          queryFlags(reqObj.geneId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }

    // Gene Comments
    function queryComments(geneId) {
      return GenesResource.queryComments({
        geneId: geneId
      }).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }

    function getComment(geneId, commentId) {
      return GenesResource.getComment({
        geneId: geneId,
        commentId: commentId
      }).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function submitComment(reqObj) {
      return GenesResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/genes/' + reqObj.geneId + '/comments');
          queryComments(reqObj.geneId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }

    function updateComment(reqObj) {
      return GenesResource.updateComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/genes/' + reqObj.geneId + '/comments');
          queryComments(reqObj.geneId);
          return response.$promise;
        });
    }

    function deleteComment(commentId) {
      return GenesResource.deleteComment({
        geneId: item.id,
        commentId: commentId
      }).$promise
        .then(function(response) {
          cache.remove('/api/genes/' + item.id + '/comments');
          queryComments(item.id);
          return response.$promise;
        });
    }
  }
})();
