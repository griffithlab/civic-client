(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GenesResource', GenesResource)
    .factory('Genes', GenesService);

  // @ngInject
  function GenesResource($resource, $cacheFactory) {
    var cache = $cacheFactory('genesCache');

    var cacheInterceptor =function(response) {
      cache.remove(response.config.url);
      return response;
    };

    return $resource('/api/genes/:geneId',
      {
        geneId: '@entrez_id'
      },
      {
        query: { // get a list of all genes
          method: 'GET',
          cache: cache
        },
        get: { // get a single gene
          method: 'GET',
          isArray: false,
          cache: cache
        },
        update: {
          method: 'PUT',
          interceptor: {
            response: cacheInterceptor
          }
        },
        getVariants: {
          url: '/api/genes/:geneId/variants',
          method: 'GET'
        },
        getComments: {
          url: '/api/genes/:geneId/comments',
          method: 'GET'
        },
        getComment: {
          url: '/api/genes/:geneId/comments/:commentId',
          params: {
            geneId: '@geneId',
            commentId: '@commentId'
          },
          method: 'GET',
          isArray: false
        },
        addComment: {
          url: '/api/genes/:geneId/comments',
          params: {
            geneId: '@geneId'
          },
          method: 'POST'
        },
        updateComment: {
          url: '/api/genes/:geneId/comments/:commentId',
          params: {
            geneId: '@geneId',
            commentId: '@commentId'
          },
          method: 'PATCH'
        },
        deleteComment: {
          url: '/api/genes/:geneId/comments/:commentId',
          params: {
            geneId: '@geneId',
            commentId: '@commentId'
          },
          method: 'DELETE'
        },
        getRevisions: {
          url: '/api/genes/:geneId/revisions',
          method: 'GET'
        },
        getRevision: {
          url: '/api/genes/:geneId/revisions/:revisionId',
          params: {
            geneId: '@geneId',
            revisionId: '@revisionId'
          },
          method: 'GET',
          isArray: false
        },
        getLastRevision: {
          url: '/api/genes/:geneId/revisions/last',
          params: {
            geneId: '@geneId'
          },
          method: 'GET',
          isArray: false
        },
        getChanges: {
          url: '/api/genes/:geneId/suggested_changes',
          method: 'GET'
        },
        getChange: {
          url: '/api/genes/:geneId/suggested_changes/:changeId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          method: 'GET',
          isArray: false
        },
        acceptChange: {
          url: '/api/genes/:geneId/suggested_changes/:changeId/accept',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        rejectChange: {
          url: '/api/genes/:geneId/suggested_changes/:changeId/reject',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        addChangeComment: {
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        updateChangeComment: {
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments/:commentId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'PATCH'
        },
        getChangeComments: {
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          method: 'GET'
        },
        getChangeComment: {
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments/:commentId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'GET',
          isArray: false
        },
        deleteChangeComment: {
          url: '/api/genes/:geneId/suggested_changes/:changeId/comments/:commentId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'DELETE'
        },
      });
  }

  //ngInject
  function GenesService(GenesResource) {
    return {
      // Gene actions
      get: function(entrez_id) {
        return GenesResource.get({geneId: entrez_id}).$promise
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

      // Gene comments
      addComment: function(reqObj) {
        return GenesResource.addComment(reqObj).$promise
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
      getComments: function(entrez_id) {
        return GenesResource.getComments({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getComment: function(reqObj) {
        return GenesResource.getComment(reqObj).$promise
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
