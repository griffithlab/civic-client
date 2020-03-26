(function() {
  'use strict';
  angular.module('civic.services')
    .factory('AssertionRevisionsResource', AssertionRevisionsResource)
    .factory('AssertionRevisions', AssertionRevisionsService);

  function AssertionRevisionsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // adding this interceptor to a route will remove cached record
    var cacheResponseInterceptor = function(response) {
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/assertions/:assertionId/suggested_changes/:revisionId',
      {
        assertionId: '@assertionId',
        revisionId: '@revisionId'
      },
      {
        // Base Assertion Revisions Resources
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
        getPendingFields: {
          method: 'GET',
          url: '/api/assertions/:assertionId/fields_with_pending_changes',
          params: {
            assertionId: '@assertionId'
          },
          cache: false
        },
        acceptRevision: {
          method: 'POST',
          url: '/api/assertions/:assertionId/suggested_changes/:revisionId/accept',
          params: {
            assertionId: '@assertionId',
            revisionId: '@revisionId',
            force: true
          },
          cache: false
        },
        rejectRevision: {
          method: 'POST',
          url: '/api/assertions/:assertionId/suggested_changes/:revisionId/reject',
          params: {
            assertionId: '@assertionId',
            revisionId: '@revisionId',
            force: true
          },
          cache: false
        },

        // Assertion Revisions Comments Resources
        submitComment: {
          method: 'POST',
          url: '/api/assertions/:assertionId/suggested_changes/:revisionId/comments',
          params: {
            assertionId: '@assertionId',
            revisionId: '@revisionId'
          },
          cache: false
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/assertions/:assertionId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            assertionId: '@assertionId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheResponseInterceptor
          }
        },
        queryComments: {
          method: 'GET',
          url: '/api/assertions/:assertionId/suggested_changes/:revisionId/comments',
          params: {
            assertionId: '@assertionId',
            revisionId: '@revisionId'
          },
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/assertions/:assertionId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            assertionId: '@assertionId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/assertions/:assertionId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            assertionId: '@assertionId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          cache: false
        }
      }
    );
  }

  function AssertionRevisionsService(AssertionRevisionsResource, Assertions, Subscriptions, $cacheFactory, $q) {
    // fetch assertions cache, need to delete assertion record when revision is submitted
    var cache = $cacheFactory.get('$http');

    // Base Assertion Revision and Assertion Revisions Collection
    var item = {};
    var parent = Assertions.data.item;
    var collection = [];

    // Assertion Revisions Comments
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

      // Assertion Revisions Base
      query: query,
      get: get,
      getPendingFields: getPendingFields,
      submitRevision: submitRevision,
      acceptRevision: acceptRevision,
      rejectRevision: rejectRevision,

      // Assertion Revisions Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment
    };

    function initBase(assertionId, revisionId) {
      return $q.all([
        query(assertionId, revisionId)
      ]);
    }

    function initRevisions(assertionId) {
      return $q.all([
        query(assertionId)
      ]);
    }

    function initComments(assertionId, revisionId) {
      return $q.all([
        query(assertionId, revisionId)
      ]);
    }

    // Assertion Revisions Base
    function query(assertionId) {
      return AssertionRevisionsResource.query({ assertionId: assertionId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function get(assertionId, revisionId) {
      return AssertionRevisionsResource.get({ assertionId: assertionId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function getPendingFields(assertionId) {
      return AssertionRevisionsResource.getPendingFields({ assertionId: assertionId }).$promise
        .then(function(response) {
          angular.copy(response.toJSON(), pendingFields);
          return response.$promise;
        });
    }

    function submitRevision(reqObj) {
      reqObj.assertionId = reqObj.id;
      return AssertionRevisionsResource.submitRevision(reqObj).$promise.then(
        function(response) { // success
          cache.remove('/api/assertions/' + reqObj.id + '/suggested_changes/');

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return $q.when(response);
        },
        function(error) { //fail
          return $q.reject(error);
        });
    }

    function acceptRevision(assertionId, revisionId, organization) {
      return AssertionRevisionsResource.acceptRevision({
        assertionId: assertionId,
        revisionId: revisionId,
        organization: organization
      }).$promise.then(
        function(response) {
          cache.remove('/api/assertions/' + assertionId + '/suggested_changes/');
          query(assertionId);
          cache.remove('/api/assertions/' + assertionId + '/suggested_changes/' + revisionId);
          get(assertionId, revisionId);
          cache.remove('/api/assertions/' + assertionId );
          Assertions.get(assertionId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return $q.when(response);
        },
        function(error) {
          return $q.reject(error);
        });
    }
    function rejectRevision(assertionId, revisionId, organization) {
      return AssertionRevisionsResource.rejectRevision({
        assertionId: assertionId,
        revisionId: revisionId,
        organization: organization
      }).$promise.then(
        function(response) {
          cache.remove('/api/assertions/' + response.id + '/suggested_changes/');
          query(assertionId);
          cache.remove('/api/assertions/' + response.id + '/suggested_changes/' + revisionId);
          get(assertionId, revisionId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return $q.when(response);
        },
        function(error) {
          return $q.reject(error);
        });
    }

    // Assertion Revisions Comments
    function queryComments(assertionId, revisionId) {
      return AssertionRevisionsResource.queryComments({ assertionId: assertionId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(assertionId, revisionId, commentId) {
      return AssertionRevisionsResource.getComment({ assertionId: assertionId, revisionId: revisionId, commentId: commentId }).$promise
        .then(function(response) {
          angular.copy(response, comment);
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return AssertionRevisionsResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/assertions/' + reqObj.assertionId + '/suggested_changes/' + reqObj.revisionId + '/comments');
          queryComments(reqObj.assertionId, reqObj.revisionId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return AssertionRevisionsResource.updateComment(reqObj).$promise
        .then(function(response) {
          angular.copy(response, comment);
          cache.remove('/api/assertions/' + reqObj.assertionId + '/suggested_changes/' + reqObj.revisionId + '/comments');
          cache.remove('/api/assertions/' + reqObj.assertionId + '/suggested_changes/' + reqObj.revisionId + '/comments/' + reqObj.commentId);
          queryComments(reqObj.assertionId, reqObj.revisionId);
          return response.$promise;
        });
    }
    function deleteComment(commentId) {
      return AssertionRevisionsResource.deleteComment({ assertionId: parent.id, revisionId: item.id, commentId: commentId }).$promise
        .then(function(response) {
          cache.remove('/api/assertions/' + parent.id + '/suggested_changes/' + item.id+ '/comments');
          queryComments(parent.id, item.id);
          return response.$promise;
        });
    }
  }
})();
