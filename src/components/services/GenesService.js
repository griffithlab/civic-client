(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GenesResource', GenesResource)
    .factory('Genes', GenesService);

  // @ngInject
  function GenesResource($resource, $cacheFactory) {
    // ngResource normally automatically handles caches but we need
    // to manually remove records in the update/delete
    // custom functions on this resource
    var cache = $cacheFactory('genesCache');
    var cacheInterceptor = function(response) {
      cache.remove(response.config.url);
      return response;
    };

    return $resource('/api/genes/:geneId',
      {
        geneId: '@geneId'
      },
      {
        // base Gene routes
        add: {
          method: 'POST',
          cache: cache
        },
        query: { // get list of genes
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
            response: cacheInterceptor
          }
        },
        refresh: { // get gene, force cache
          method: 'GET',
          isArray: false,
          cache: false
        },
        delete: { // delete a single gene
          method: 'DELETE',
          interceptor: {
            response: cacheInterceptor
          }
        },
        getVariants: {
          isArray: true,
          method: 'GET',
          url: '/api/genes/:geneId/variants',
          cache: cache
        },
        queryVariantGroups: {
          method: 'GET',
          url: '/api/genes/:geneId/variant_groups',
          isArray: true,
          cache: cache
        },

        // Gene Comments routes
        getComments: {
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
            response: cacheInterceptor
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
            response: cacheInterceptor
          }
        },

        // Gene Changes routes
        submitChange: {
          method: 'POST',
          url: '/api/genes/:geneId/suggested_changes',
          params: {
            geneId: '@geneId'
          },
          cache: cache
        },
        getChanges: {
          method: 'GET',
          url: '/api/genes/:geneId/suggested_changes',
          params: {
            geneId: '@geneId'
          },
          isArray: true
        },
        getChange: {
          method: 'GET',
          url: '/api/genes/:geneId/suggested_changes/:changeId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          isArray: false
        },
        acceptChange: {
          method: 'POST',
          url: '/api/genes/:geneId/suggested_changes/:changeId/accept',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          }
        },
        rejectChange: {
          method: 'POST',
          url: '/api/genes/:geneId/suggested_changes/:changeId/reject',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          isArray: false
        },

        // Gene Revisions routes
        getRevisions: {
          method: 'GET',
          url: '/api/genes/:geneId/revisions',
          cache: cache,
          isArray: true
        },
        getRevision: {
          method: 'GET',
          url: '/api/genes/:geneId/revisions/:revisionId',
          params: {
            geneId: '@geneId',
            revisionId: '@revisionId'
          },
          isArray: false,
          cache: cache
        },
        getLastRevision: {
          method: 'GET',
          url: '/api/genes/:geneId/revisions/last',
          params: {
            geneId: '@geneId'
          },
          isArray: false
        },

        // Gene Change Comments routes
        submitChangeComment: {
          method: 'POST',
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          }
        },
        updateChangeComment: {
          method: 'PATCH',
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments/:commentId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheInterceptor
          }
        },
        getChangeComments: {
          method: 'GET',
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          isArray: true,
          cache: cache
        },
        getChangeComment: {
          method: 'GET',
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments/:commentId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          cache: cache
        },
        deleteChangeComment: {
          method: 'DELETE',
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments/:commentId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId',
            commentId: '@commentId'
          }
        }
      });
  }

  //ngInject
  function GenesService(GenesResource) {
    return {
      // Gene actions
      add: function(reqObj) {
        return GenesResource.add(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      delete: function(geneId) {
        return GenesResource.delete({geneId: geneId}).$promise
          .then(function(response) {
            return response;
          });
      },
      get: function(geneId) {
        return GenesResource.get({geneId: geneId}).$promise
          .then(function(response) {
            return response;
          });
      },
      refresh: function(geneId) {
        return GenesResource.refresh({geneId: geneId}).$promise
          .then(function(response) {
            return response;
          });
      },
      query: function() {
        return GenesResource.query().$promise
          .then(function(response) {
            return response;
          });
      },
      update: function(reqObj) {
        return GenesResource.update(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getVariants: function(geneId) {
        return GenesResource.getVariants({geneId: geneId}).$promise
          .then(function(response) {
            return response;
          });
      },
      getVariantGroups: function(geneId) {
        return GenesResource.queryVariantGroups({geneId: geneId}).$promise
          .then(function(response) {
            return response;
          });
      },

      // Gene comments
      submitComment: function(reqObj) {
        return GenesResource.submitComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getComments: function(geneId) {
        return GenesResource.getComments({geneId: geneId}).$promise
          .then(function(response) {
            return response;
          });
      },
      getComment: function(geneId, commentId) {
        return GenesResource.getComment({geneId: geneId, commentId: commentId}).$promise
          .then(function(response) {
            return response;
          });
      },
      updateComment: function(reqObj) {
        return GenesResource.updateComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      deleteComment: function(reqObj) {
        return GenesResource.deleteComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Gene suggested changes
      submitChange: function(reqObj) {
        return GenesResource.submitChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChanges: function(geneId) {
        return GenesResource.getChanges({ geneId: geneId }).$promise
          .then(function(response) {
            return response;
          });
      },
      getChange: function(reqObj) {
        return GenesResource.getChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(reqObj) {
        return GenesResource.acceptChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      rejectChange: function(reqObj) {
        return GenesResource.rejectChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Gene revisions
      getRevisions: function(geneId) {
        return GenesResource.getRevisions({geneId: geneId}).$promise
          .then(function(response) {

            return response;
          });
      },
      getRevision: function(reqObj) {
        return GenesResource.getRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function(geneId) {
        return GenesResource.getLastRevision({geneId: geneId}).$promise
          .then(function(response) {
            return response;
          });
      },

      // Gene suggested changes comments
      submitChangeComment: function(reqObj) {
        return GenesResource.submitChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        return GenesResource.updateChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(reqObj) {
        return GenesResource.getChangeComments(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChangeComment: function(reqObj) {
        return GenesResource.getChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      deleteChangeComment: function(reqObj) {
        return GenesResource.deleteChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
