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
        variantId: '@variant_id'
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
        delete: {
          method: 'DELETE',
          cache: cache
        },
        update: {
          method: 'PATCH',
          interceptor: {
            response: cacheInterceptor
          }
        },
        refresh: { // get variant, force cache refresh
          method: 'GET',
          isArray: false,
          cache: false
        },
        getEvidenceItems: {
          url: '/api/variants/:variantId/evidence_items',
          method: 'GET',
          isArray: true
        },
        getVariantGroups: {
          url: '/api/variants/:variantId/variant_groups',
          method: 'GET',
          isArray: true
        },
        getComments: {
          url: '/api/variants/:variantId/comments',
          method: 'GET',
          isArray: true
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
          method: 'GET',
          isArray: true
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
        submitChange: {
          method: 'POST',
          url: '/api/variants/:variantId/suggested_changes',
          params: {
            variantId: '@variantId'
          }
        },
        getChanges: {
          url: '/api/variants/:variantId/suggested_changes',
          method: 'GET',
          isArray: true
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
        submitChangeComment: {
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
          method: 'GET',
          isArray: true
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
      delete: function(variant_id) {
        return VariantsResource.delete({variantId: variant_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      get: function(variant_id) {
        return VariantsResource.get({variantId: variant_id}).$promise
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
      refresh: function(variant_id) {
        return VariantsResource.refresh({variantId: variant_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getEvidenceItems: function(variant_id) {
        return VariantsResource.getEvidenceItems({variantId: variant_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getVariantGroups: function(variant_id) {
        return VariantsResource.getVariantGroups({variantId: variant_id}).$promise
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
      getComments: function(variant_id) {
        return VariantsResource.getComments({variantId: variant_id}).$promise
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
      getRevisions: function(variant_id) {
        return VariantsResource.getRevisions({variantId: variant_id}).$promise
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
      getLastRevision: function(variant_id) {
        return VariantsResource.getLastRevision({variantId: variant_id}).$promise
          .then(function(response) {
            return response;
          });
      },

      // Variant suggested changes
      submitChange: function(reqObj) {
        return VariantsResource.submitChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChanges: function(variant_id) {
        return VariantsResource.getChanges({variantId: variant_id}).$promise
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
      submitChangeComment: function(reqObj) {
        return VariantsResource.submitChangeComment(reqObj).$promise
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
