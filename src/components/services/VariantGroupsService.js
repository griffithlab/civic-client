(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupsResource', VariantGroupsResource)
    .factory('VariantGroups', VariantGroupsService);

  // @ngInject
  function VariantGroupsResource($resource, $cacheFactory) {
    var cache = $cacheFactory('variantGroupsCache');

    var cacheInterceptor= function(response) {
      cache.remove(response.config.url);
      return response;
    };

    var VariantGroups= $resource('/api/variant_groups/:variantGroupId',
      { variantGroupId: '@variantGroupId' },
      {
        // core
        add: {
          method: 'POST',
          cache: cache
        },
        query: { // get a list of all variants
          method: 'GET',
          isArray: true,
          cache: true
        },
        get: { // get a single variant group
          method: 'GET',
          isArray: false,
          cache: true
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

        // comments
        getComments: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/comments',
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },
        submitComment: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/comments',
          params: {
            variantGroupId: '@variantGroupId'
          },
          cache: cache
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/variant_groups/:variantGroupId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheInterceptor
          }
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/variant_groups/:variantGroupId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheInterceptor
          }
        },

        // changes
        submitChange: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes',
          params: {
            variantGroupId: '@variantGroupId'
          },
          cache: cache
        },
        getChanges: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/suggested_changes',
          params: {
            variantGroupId: '@variantGroupId'
          },
          isArray: true
        },
        getChange: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:changeId',
          params: {
            variantGroupId: '@variantGroupId',
            changeId: '@changeId'
          },
          isArray: false
        },
        acceptChange: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:changeId/accept',
          params: {
            variantGroupId: '@variantGroupId',
            changeId: '@changeId'
          }
        },
        rejectChange: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:changeId/reject',
          params: {
            variantGroupId: '@variantGroupId',
            changeId: '@changeId'
          },
          isArray: false
        },

        // revisions
        getRevisions: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/revisions',
          cache: cache,
          isArray: true
        },
        getRevision: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/revisions/:revisionId',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId'
          },
          isArray: false,
          cache: cache
        },
        getLastRevision: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/revisions/last',
          params: {
            variantGroupId: '@variantGroupId'
          },
          isArray: false
        },

        // Gene Change Comments routes
        submitChangeComment: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:changeId/comments',
          params: {
            variantGroupId: '@variantGroupId',
            changeId: '@changeId'
          }
        },
        updateChangeComment: {
          method: 'PATCH',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:changeId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheInterceptor
          }
        },
        getChangeComments: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:changeId/comments',
          params: {
            variantGroupId: '@variantGroupId',
            changeId: '@changeId'
          },
          isArray: true,
          cache: cache
        },
        getChangeComment: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:changeId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          cache: cache
        },
        deleteChangeComment: {
          method: 'DELETE',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:changeId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            changeId: '@changeId',
            commentId: '@commentId'
          }
        }

      });

    return VariantGroups;
  }

  // @ngInject
  function VariantGroupsService(VariantGroupsResource) {
    return {
      // core
      add: function(reqObj) {
        return VariantGroupsResource.add(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      delete: function(variantGroupId) {
        return VariantGroupsResource.delete({variantGroupId: variantGroupId}).$promise
          .then(function(response) {
            return response;
          });
      },
      get: function (variantGroupId) {
        return VariantGroupsResource.get({variantGroupId: variantGroupId}).$promise
          .then(function (response) {
            return response;
          });
      },
      query: function () {
        return VariantGroupsResource.query().$promise
          .then(function (response) {
            return response;
          });
      },
      update: function (reqObj) {
        return VariantGroupsResource.update(reqObj).$promise
          .then(function (response) {
            return response;
          });
      },
      refresh: function(variantGroupId) {
        return VariantGroupsResource.refresh({variantGroupId: variantGroupId}).$promise
          .then(function(response) {
            return response;
          });
      },

      // comments
      submitComment: function(reqObj) {
        return VariantGroupsResource.submitComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getComments: function(variantGroupId) {
        return VariantGroupsResource.getComments({variantGroupId: variantGroupId}).$promise
          .then(function(response) {
            return response;
          });
      },
      getComment: function(variantGroupId, commentId) {
        return VariantGroupsResource.getComment({variantGroupId: variantGroupId, commentId: commentId}).$promise
          .then(function(response) {
            return response;
          });
      },
      updateComment: function(reqObj) {
        return VariantGroupsResource.updateComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      deleteComment: function(reqObj) {
        return VariantGroupsResource.deleteComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // suggested changes
      submitChange: function(reqObj) {
        return VariantGroupsResource.submitChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChanges: function(variantGroupId) {
        return VariantGroupsResource.getChanges({ variantGroupId: variantGroupId }).$promise
          .then(function(response) {
            return response;
          });
      },
      getChange: function(variantGroupId, changeId) {
        return VariantGroupsResource.getChange({ variantGroupId: variantGroupId, changeId: changeId }).$promise
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(variantGroupId, changeId) {
        return VariantGroupsResource.acceptChange({ variantGroupId: variantGroupId, changeId: changeId }).$promise
          .then(function(response) {
            return response;
          });
      },
      rejectChange: function(variantGroupId, changeId) {
        return VariantGroupsResource.rejectChange({ variantGroupId: variantGroupId, changeId: changeId }).$promise
          .then(function(response) {
            return response;
          });
      },

      // revisions
      getRevisions: function(variantGroupId) {
        return VariantGroupsResource.getRevisions({variantGroupId: variantGroupId}).$promise
          .then(function(response) {
            return response;
          });
      },
      getRevision: function(reqObj) {
        return VariantGroupsResource.getRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function(variantGroupId) {
        return VariantGroupsResource.getLastRevision({variantGroupId: variantGroupId}).$promise
          .then(function(response) {
            return response;
          });
      },
    }
  }

})();
