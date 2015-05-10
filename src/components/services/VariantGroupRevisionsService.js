(function() {
  angular.module('civic.services')
    .factory('VariantGroupRevisionsResource', VariantGroupRevisionsResource)
    .factory('VariantGroupRevisions', VariantGroupRevisionsService);

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
        submitRevision: {
          method: 'POST',
          cache: false
        },
        acceptRevision: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/accept',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId'
          },
          cache: false
        },
        rejectRevision: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/reject',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId'
          },
          cache: cache
        },

        // Base VariantGroup Revisions Refresh
        queryFresh: {
          method: 'GET',
          isArray: true,
          cache: false
        },
        getFresh: {
          method: 'GET',
          isArray: false,
          cache: false
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
          interceptor: {
            response: cacheResponseInterceptor
          }
        },

        // VariantGroup Revisions Comments Resources Refresh
        queryCommentsFresh: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/comments',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId'
          },
          isArray: true,
          cache: false
        },
        getCommentFresh: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: false
        }
      }
    )
  }

  function VariantGroupRevisionsService(VariantGroupRevisionsResource, VariantGroups, $cacheFactory, $q) {
    var cache = $cacheFactory.get('$http');

    // Base VariantGroup Revision and VariantGroup Revisions Collection
    var item = {};
    var collection = [];

    // VariantGroup Revisions Comments
    var comment = {};
    var comments = [];

    return {
      initBase: initBase,
      initRevisions: initRevisions,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        comment: comment,
        comments: comments
      },

      // VariantGroup Revisions Base
      query: query,
      get: get,
      submitRevision: submitRevision,
      acceptRevision: acceptRevision,
      rejectRevision: rejectRevision,

      // VariantGroup Revisions Base Refresh
      queryFresh: queryFresh,
      getFresh: getFresh,

      // VariantGroup Revisions Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      // VariantGroup Revisions Comments Refresh
      queryCommentsFresh: queryCommentsFresh,
      getCommentFresh: getCommentFresh
    };

    function initBase(variantGroupId, revisionId) {
      return $q.all([
        query(variantGroupId, revisionId)
      ])
    }

    function initRevisions(variantGroupId) {
      return $q.all([
        query(variantGroupId)
      ])
    }

    function initComments(variantGroupId, revisionId) {
      return $q.all([
        query(variantGroupId, revisionId)
      ])
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
        })
    }

    function submitRevision(reqObj) {
      return VariantGroupRevisionsResource.submitRevision(reqObj).$promise.then(
        function(response) { // success
          cache.remove('/api/variant_groups/' + reqObj.id + '/suggested_changes');
          return $q.when(response);
        },
        function(error) { //fail
          return $q.reject(error);
        });
    }

    function acceptRevision(variantGroupId, revisionId) {
      return VariantGroupRevisionsResource.acceptRevision({ variantGroupId: variantGroupId, revisionId: revisionId }).$promise.then(
        function(response) {
          cache.remove('/api/variant_groups/' + variantGroupId + '/suggested_changes');
          cache.remove('/api/variant_groups/' + variantGroupId + '/suggested_changes/' + revisionId);
          cache.remove('/api/variant_groups/' + variantGroupId );
          query(variantGroupId);
          get(variantGroupId, revisionId);
          VariantGroups.get(variantGroupId);
          return $q.when(response)
        },
        function(error) {
          return $q.reject(error);
        });
    }
    function rejectRevision(variantGroupId, revisionId) {
      return VariantGroupRevisionsResource.rejectRevision({ variantGroupId: variantGroupId, revisionId: revisionId }).$promise.then(
        function(response) {
          cache.remove('/api/variant_groups/' + response.id + '/suggested_changes');
          queryFresh(variantGroupId);
          cache.remove('/api/variant_groups/' + response.id + '/suggested_changes/' + revisionId);
          getFresh(variantGroupId, revisionId);
          return $q.when(response);
        },
        function(error) {
          return $q.reject(error);
        });
    }

    // VariantGroup Revisions Base Refresh
    function queryFresh(variantGroupId) { // works
      return VariantGroupRevisionsResource.queryFresh({ variantGroupId: variantGroupId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function getFresh(variantGroupId, revisionId) {
      return VariantGroupRevisionsResource.getFresh({ variantGroupId: variantGroupId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
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
          queryCommentsFresh(reqObj.variantGroupId, reqObj.revisionId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return VariantGroupRevisionsResource.updateComment(reqObj).$promise
        .then(function(response) {
          angular.copy(response, comment);
          getCommentFresh(reqObj);
          return response.$promise;
        });
    }
    function deleteComment(variantGroupId, revisionId, commentId) {
      return VariantGroupRevisionsResource.deleteComment({ variantGroupId: variantGroupId, revisionId: revisionId, commentId: commentId }).$promise
        .then(function(response) {
          comment = null;
          return response.$promise;
        });
    }

    // VariantGroup Revisions Comments Refresh
    function queryCommentsFresh(variantGroupId, revisionId) {
      return VariantGroupRevisionsResource.queryCommentsFresh({ variantGroupId: variantGroupId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getCommentFresh(variantGroupId, revisionId, commentId) {
      return VariantGroupRevisionsResource.getCommentFresh({ variantGroupId: variantGroupId, revisionId: revisionId, commentId: commentId }).$promise
        .then(function(response) {
          angular.copy(response   , comment);
          return response.$promise;
        });
    }
  }
})();
