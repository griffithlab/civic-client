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
        geneId: '@entrez_id'
      },
      {
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
        addComment: {
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
        getRevisions: {
          method: 'GET',
          url: '/api/genes/:geneId/revisions',
          cache: cache
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
        getChanges: {
          method: 'GET',
          url: '/api/genes/:geneId/suggested_changes'
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
          }
        },
        addChangeComment: {
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
      delete: function(entrez_id) {
        return GenesResource.delete({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      get: function(entrez_id) {
        return GenesResource.get({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      refresh: function(entrez_id) {
        return GenesResource.refresh({geneId: entrez_id}).$promise
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
      getVariants: function(entrez_id) {
        return GenesResource.getVariants({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getVariantGroups: function(entrez_id) {
        return GenesResource.queryVariantGroups({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },

      // Gene comments
      addComment: function(reqObj) {
        return GenesResource.addComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getComments: function(entrez_id) {
        return GenesResource.getComments({geneId: entrez_id}).$promise
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

      // Gene revisions
      getRevisions: function(entrez_id) {
        return GenesResource.getRevisions({geneId: entrez_id}).$promise
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
      getLastRevision: function(reqObj) {
        return GenesResource.getLastRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Gene suggested changes
      getChanges: function(entrez_id) {
        return GenesResource.getChanges({geneId: entrez_id}).$promise
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

      // Gene suggested changes comments
      addChangeComment: function(reqObj) {
        return GenesResource.addChangeComment(reqObj).$promise
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
