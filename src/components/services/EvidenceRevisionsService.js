(function() {
  'use strict';
  angular.module('civic.services')
    .factory('EvidenceRevisionsResource', EvidenceRevisionsResource)
    .factory('EvidenceRevisions', EvidenceRevisionsService);

  function EvidenceRevisionsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // adding this interceptor to a route will remove cached record
    var cacheResponseInterceptor = function(response) {
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/evidence_items/:evidenceId/suggested_changes/:revisionId',
      {
        evidenceId: '@evidenceId',
        revisionId: '@revisionId'
      },
      {
        // Base Evidence Revisions Resources
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
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/accept',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId'
          },
          cache: false
        },
        rejectRevision: {
          method: 'POST',
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/reject',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId'
          },
          cache: cache
        },

        // Base Evidence Revisions Refresh
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

        // Evidence Revisions Comments Resources
        submitComment: {
          method: 'POST',
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/comments',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId'
          },
          cache: false
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheResponseInterceptor
          }
        },
        queryComments: {
          method: 'GET',
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/comments',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId'
          },
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          cache: false
        },

        // Evidence Revisions Comments Resources Refresh
        queryCommentsFresh: {
          method: 'GET',
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/comments',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId'
          },
          isArray: true,
          cache: false
        },
        getCommentFresh: {
          method: 'GET',
          url: '/api/evidence_items/:evidenceId/suggested_changes/:revisionId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: false
        }
      }
    );
  }

  function EvidenceRevisionsService(
    $cacheFactory,
    $q,
    Variants,
    EvidenceRevisionsResource,
    Evidence) {
    // fetch evidence cache, need to delete evidence record when revision is submitted
    var cache = $cacheFactory.get('$http');

    // Base Evidence Revision and Evidence Revisions Collection
    var item = {};
    var parent = Evidence.data.item;
    var collection = [];

    // Evidence Revisions Comments
    var comment = {};
    var comments = [];

    return {
      initBase: initBase,
      initRevisions: initRevisions,
      initComments: initComments,
      data: {
        item: item,
        parent: parent,
        collection: collection,
        comment: comment,
        comments: comments
      },

      // Evidence Revisions Base
      query: query,
      get: get,
      submitRevision: submitRevision,
      acceptRevision: acceptRevision,
      rejectRevision: rejectRevision,

      // Evidence Revisions Base Refresh
      queryFresh: queryFresh,
      getFresh: getFresh,

      // Evidence Revisions Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      // Evidence Revisions Comments Refresh
      queryCommentsFresh: queryCommentsFresh,
      getCommentFresh: getCommentFresh
    };

    function initBase(evidenceId, revisionId) {
      return $q.all([
        query(evidenceId, revisionId)
      ]);
    }

    function initRevisions(evidenceId) {
      console.log('EvidenceRevisionsService.initRevisions called.');
      return $q.all([
        query(evidenceId)
      ]);
    }

    function initComments(evidenceId, revisionId) {
      return $q.all([
        query(evidenceId, revisionId)
      ]);
    }

    // Evidence Revisions Base
    function query(evidenceId) {
      return EvidenceRevisionsResource.query({ evidenceId: evidenceId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function get(evidenceId, revisionId) {
      return EvidenceRevisionsResource.get({ evidenceId: evidenceId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function submitRevision(reqObj) {
      return EvidenceRevisionsResource.submitRevision(reqObj).$promise.then(
        function(response) { // success
          cache.remove('/api/evidence_items/' + reqObj.id + '/suggested_changes/');
          return $q.when(response);
        },
        function(error) { //fail
          return $q.reject(error);
        });
    }

    function acceptRevision(evidenceId, revisionId, variantId) {
      return EvidenceRevisionsResource.acceptRevision({ evidenceId: evidenceId, revisionId: revisionId }).$promise.then(
        function(response) {
          // flush evidence_item cache and refresh, in order to update the variant summary evidence grid
          cache.remove('/api/variants/' + variantId);
          cache.remove('/api/variants/' + variantId + '/evidence_items');
          Variants.queryEvidence(variantId);
          // refresh suggested changes
          cache.remove('/api/evidence_items/' + evidenceId + '/suggested_changes/');
          query(evidenceId);
          // refresh revision
          cache.remove('/api/evidence_items/' + evidenceId + '/suggested_changes/' + revisionId);
          // refresh evidence item
          get(evidenceId, revisionId);
          cache.remove('/api/evidence_items/' + evidenceId );
          Evidence.get(evidenceId);
          return $q.when(response);
        },
        function(error) {
          return $q.reject(error);
        });
    }
    function rejectRevision(evidenceId, revisionId) {
      return EvidenceRevisionsResource.rejectRevision({ evidenceId: evidenceId, revisionId: revisionId }).$promise.then(
        function(response) {
          cache.remove('/api/evidence_items/' + response.id + '/suggested_changes/');
          query(evidenceId);
          cache.remove('/api/evidence_items/' + response.id + '/suggested_changes/' + revisionId);
          get(evidenceId, revisionId);
          return $q.when(response);
        },
        function(error) {
          return $q.reject(error);
        });
    }

    // Evidence Revisions Base Refresh
    function queryFresh(evidenceId) { // works
      return EvidenceRevisionsResource.queryFresh({ evidenceId: evidenceId }).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function getFresh(evidenceId, revisionId) {
      return EvidenceRevisionsResource.getFresh({ evidenceId: evidenceId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    // Evidence Revisions Comments
    function queryComments(evidenceId, revisionId) {
      return EvidenceRevisionsResource.queryComments({ evidenceId: evidenceId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(evidenceId, revisionId, commentId) {
      return EvidenceRevisionsResource.getComment({ evidenceId: evidenceId, revisionId: revisionId, commentId: commentId }).$promise
        .then(function(response) {
          angular.copy(response, comment);
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return EvidenceRevisionsResource.submitComment(reqObj).$promise
        .then(function(response) {
          queryCommentsFresh(reqObj.evidenceId, reqObj.revisionId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return EvidenceRevisionsResource.updateComment(reqObj).$promise
        .then(function(response) {
          angular.copy(response, comment);
          getCommentFresh(reqObj);
          return response.$promise;
        });
    }
    function deleteComment(commentId) {
      return EvidenceRevisionsResource.deleteComment({ evidenceId: parent.id, revisionId: item.id, commentId: commentId }).$promise
        .then(function(response) {
          cache.remove('/api/evidence_items/' + parent.id + '/suggested_changes/' + item.id + '/comments');
          queryComments(parent.id, item.id);
          return response.$promise;
        });
    }

    // Evidence Revisions Comments Refresh
    function queryCommentsFresh(evidenceId, revisionId) {
      return EvidenceRevisionsResource.queryCommentsFresh({ evidenceId: evidenceId, revisionId: revisionId }).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getCommentFresh(evidenceId, revisionId, commentId) {
      return EvidenceRevisionsResource.getCommentFresh({ evidenceId: evidenceId, revisionId: revisionId, commentId: commentId }).$promise
        .then(function(response) {
          angular.copy(response   , comment);
          return response.$promise;
        });
    }
  }
})();
