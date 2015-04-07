(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantsResource', VariantsResource)
    .factory('Variants', VariantsService);

  // @ngInject
  function VariantsResource($resource, $cacheFactory) {
    var cache = $cacheFactory('variantsCache');

    var cacheInterceptor = function(response) {
      cache.remove(response.config.url);
      return response;
    };

    return $resource('/api/variants/:variantId',
      {
        variantId: '@entrez_id'
      },
      {
        add: {
          method: 'POST',
          cache: cache
        },
        query: { // get a list of all variants
          method: 'GET',
          cache: cache
        },
        get: { // get a single variant
          method: 'GET',
          isArray: false,
          cache: cache
        },
        delete: { // get a single variant
          method: 'DELETE',
          cache: cache
        },
        update: {
          method: 'PATCH',
          interceptor: {
            response: cacheInterceptor
          }
        },
        getEvidence: {
          url: '/api/variants/:variantId/evidence_items',
          method: 'GET'
        },
        getVariantGroups: {
          url: '/api/variants/:variantId/variant_groups',
          method: 'GET'
        },
        getComments: {
          url: '/api/variants/:variantId/comments',
          method: 'GET'
        },
        getComment: {
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          method: 'GET',
          isArray: false
        },
        submitComment: {
          url: '/api/variants/:variantId/comments',
          params: {
            variantId: '@variantId'
          },
          method: 'POST'
        },
        updateComment: {
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          method: 'PATCH'
        },
        deleteComment: {
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          method: 'DELETE'
        },
        getRevisions: {
          url: '/api/variants/:variantId/revisions',
          method: 'GET'
        },
        getRevision: {
          url: '/api/variants/:variantId/revisions/:revisionId',
          params: {
            variantId: '@variantId',
            revisionId: '@revisionId'
          },
          method: 'GET',
          isArray: false
        },
        getLastRevision: {
          url: '/api/variants/:variantId/revisions/last',
          params: {
            variantId: '@variantId'
          },
          method: 'GET',
          isArray: false
        },
        getChanges: {
          url: '/api/variants/:variantId/suggested_changes',
          method: 'GET'
        },
        getChange: {
          url: '/api/variants/:variantId/suggested_changes/:changeId',
          params: {
            variantId: '@variantId',
            changeId: '@changeId'
          },
          method: 'GET',
          isArray: false
        },
        acceptChange: {
          url: '/api/variants/:variantId/suggested_changes/:changeId/accept',
          params: {
            variantId: '@variantId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        rejectChange: {
          url: '/api/variants/:variantId/suggested_changes/:changeId/reject',
          params: {
            variantId: '@variantId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        addChangeComment: {
          url: '/api/variants/:variantId/suggested_changes/:changeId/comments',
          params: {
            variantId: '@variantId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        updateChangeComment: {
          url: '/api/variants/:variantId/suggested_changes/:changeId/comments/:commentId',
          params: {
            variantId: '@variantId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'PATCH'
        },
        getChangeComments: {
          url: '/api/variants/:variantId/suggested_changes/:changeId/comments',
          params: {
            variantId: '@variantId',
            changeId: '@changeId'
          },
          method: 'GET'
        },
        getChangeComment: {
          url: '/api/variants/:variantId/suggested_changes/:changeId/comments/:commentId',
          params: {
            variantId: '@variantId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'GET',
          isArray: false
        },
        deleteChangeComment: {
          url: '/api/variants/:variantId/suggested_changes/:changeId/comments/:commentId',
          params: {
            variantId: '@variantId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'DELETE'
        }
      });
  }

  //ngInject
  function VariantsService(VariantsResource) {
    return {
      // Variant actions
      add: function(reqObj) {
        return VariantsResource.add(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      delete: function(entrez_id) {
        return VariantsResource.delete({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      get: function(entrez_id) {
        return VariantsResource.get({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      query: function() {
        return VariantsResource.query().$promise
          .then(function(response) {
            return response;
          });
      },
      update: function(reqObj) {
        return VariantsResource.update(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getEvidence: function(entrez_id) {
        return VariantsResource.getEvidence({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getVariantGroups: function(entrez_id) {
        return VariantsResource.getVariantGroups({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },

      // Variant comments
      submitComment: function(reqObj) {
        return VariantsResource.submitComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      updateComment: function(reqObj) {
        return VariantsResource.updateComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getComments: function(entrez_id) {
        return VariantsResource.getComments({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getComment: function(reqObj) {
        return VariantsResource.getComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      deleteComment: function(reqObj) {
        return VariantsResource.deleteComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Variant revisions
      getRevisions: function(entrez_id) {
        return VariantsResource.getRevisions({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getRevision: function(reqObj) {
        return VariantsResource.getRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function(reqObj) {
        return VariantsResource.getLastRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Variant suggested changes
      getChanges: function(entrez_id) {
        return VariantsResource.getChanges({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getChange: function(reqObj) {
        return VariantsResource.getChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(reqObj) {
        return VariantsResource.acceptChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      rejectChange: function(reqObj) {
        return VariantsResource.rejectChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Variant suggested changes comments
      addChangeComment: function(reqObj) {
        return VariantsResource.addChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        return VariantsResource.updateChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(reqObj) {
        return VariantsResource.getChangeComments(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChangeComment: function(reqObj) {
        return VariantsResource.getChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      deleteChangeComment: function(reqObj) {
        return VariantsResource.deleteChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
