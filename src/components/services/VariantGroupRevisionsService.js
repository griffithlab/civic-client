(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupRevisionsResource', VariantGroupRevisionsResource)
    .factory('VariantGroupRevisions', VariantGroupRevisionsService);

  // @ngInject
  function VariantGroupRevisionsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // adding this interceptor to a route will remove cached record
    var cacheResponseInterceptor = function(response) {
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/variant_groups/:variantGroupId/suggested_changes/:revisionId',
      {
        variantGroupId: '@variantGroupId',
        revisionId: '@revisionId'
      },
      {
        // Base VariantGroup Revisions Resources
        query: {
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: {
          method: 'GET',
          isArray: false,
          cache: cache
        },
        getPendingFields: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/fields_with_pending_changes',
          params: {
            variantGroupId: '@variantGroupId'
          },
          cache: false
        },
        submitRevision: {
          method: 'POST',
          cache: false
        },
        acceptRevision: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/accept',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId',
            organization: '@organization',
            force: true
          },
          cache: false
        },
        rejectRevision: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/reject',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId',
            organization: '@organization',
            force: true
          },
          cache: cache
        },

        // VariantGroup Revisions Comments Resources
        submitComment: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/comments',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId'
          },
          cache: false
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheResponseInterceptor
          }
        },
        queryComments: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/comments',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId'
          },
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          cache: false
        }
      }
    );
  }

  // @ngInject
  function VariantGroupRevisionsService(VariantGroupRevisionsResource,
                                        VariantGroups,
                                        Genes,
                                        Subscriptions,
                                        $cacheFactory,
                                        $q,
                                        _) {
    var cache = $cacheFactory.get('$http');

    // Base VariantGroup Revision and VariantGroup Revisions Collection
    var item = {};
    var parent = VariantGroups.data.item;
    var collection = [];

    // VariantGroup Revisions Comments
    var comment = {};
    var comments = [];

    var pendingFields = {};

    return {
      initBase: initBase,
      initRevisions: initRevisions,
      initComments: initComments,
      data: {
        item: item,
        parent: parent,
        collection: collection,
        comment: comment,
        comments: comments,
        pendingFields: pendingFields
      },

      // VariantGroup Revisions Base
      query: query,
      get: get,
      getPendingFields: getPendingFields,
      submitRevision: submitRevision,
      acceptRevision: acceptRevision,
      rejectRevision: rejectRevision,

      // VariantGroup Revisions Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment

    };

    function initBase(variantGroupId, revisionId) {
      return $q.all([
        query(variantGroupId, revisionId)
      ]);
    }

    function initRevisions(variantGroupId) {
      return $q.all([
        query(variantGroupId)
      ]);
    }

    function initComments(variantGroupId, revisionId) {
      return $q.all([
        query(variantGroupId, revisionId)
      ]);
    }

    // VariantGroup Revisions Base
    function query(variantGroupId) {
      return VariantGroupRevisionsResource.query({ variantGroupId: variantGroupId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function get(variantGroupId, revisionId) {
      return VariantGroupRevisionsResource.get({ variantGroupId: variantGroupId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function getPendingFields(variantGroupId) {
      return VariantGroupRevisionsResource.getPendingFields({ variantGroupId: variantGroupId }).$promise
        .then(function(response) {
          angular.copy(response.toJSON(), pendingFields);
          return response.$promise;
        });
    }

    function submitRevision(reqObj) {
      return VariantGroupRevisionsResource.submitRevision(reqObj).$promise.then(
        function(response) { // success
          cache.remove('/api/variant_groups/' + reqObj.id + '/suggested_changes/');

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return $q.when(response);
        },
        function(error) { //fail
          return $q.reject(error);
        });
    }

    function acceptRevision(variantGroupId, revisionId, organization) {
      return VariantGroupRevisionsResource
        .acceptRevision({
          variantGroupId: variantGroupId,
          revisionId: revisionId,
          organization: organization
        }).$promise.then(
        function(response) {
          cache.remove('/api/variant_groups/' + variantGroupId + '/suggested_changes/');
          query(variantGroupId);
          cache.remove('/api/variant_groups/' + variantGroupId + '/suggested_changes/' + revisionId);
          get(variantGroupId, revisionId);
          cache.remove('/api/variant_groups/' + variantGroupId );
          VariantGroups.get(variantGroupId);

          // flush/query all gene variant group caches with this variant group
          _.each(response.gene_ids, function(id) {
            cache.remove('/api/genes/' + id + '/variant_groups');
            Genes.queryVariantGroups(id);
          });

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return $q.when(response);
        },
        function(error) {
          return $q.reject(error);
        });
    }
    function rejectRevision(variantGroupId, revisionId, organization) {
      return VariantGroupRevisionsResource.rejectRevision({ variantGroupId: variantGroupId, revisionId: revisionId, organization: organization}).$promise.then(
        function(response) {
          cache.remove('/api/variant_groups/' + response.id + '/suggested_changes/');
          query(variantGroupId);
          cache.remove('/api/variant_groups/' + response.id + '/suggested_changes/' + revisionId);
          get(variantGroupId, revisionId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return $q.when(response);
        },
        function(error) {
          return $q.reject(error);
        });
    }

    // VariantGroup Revisions Comments
    function queryComments(variantGroupId, revisionId) {
      return VariantGroupRevisionsResource.queryComments({ variantGroupId: variantGroupId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(variantGroupId, revisionId, commentId) {
      return VariantGroupRevisionsResource.getComment({ variantGroupId: variantGroupId, revisionId: revisionId, commentId: commentId }).$promise
        .then(function(response) {
          angular.copy(response, comment);
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return VariantGroupRevisionsResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/variant_groups/' + reqObj.variantGroupId + '/suggested_changes/' + reqObj.revisionId + '/comments');
          queryComments(reqObj.variantGroupId, reqObj.revisionId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return VariantGroupRevisionsResource.updateComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/variant_groups/' + reqObj.variantGroupId + '/suggested_changes/' + reqObj.revisionId + '/comments');
          return response.$promise;
        });
    }
    function deleteComment(commentId) {
      return VariantGroupRevisionsResource.deleteComment({ variantGroupId: parent.id, revisionId: item.id, commentId: commentId }).$promise
        .then(function(response) {
          cache.remove('/api/variant_groups/' + parent.id + '/suggested_changes/' + item.id + '/comments');
          queryComments(parent.id, item.id);
          return response.$promise;
        });
    }
  }
})();
