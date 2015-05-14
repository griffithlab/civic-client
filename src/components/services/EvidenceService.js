(function() {
  angular.module('civic.services')
    .factory('EvidenceResource', EvidenceResource)
    .factory('Evidence', EvidenceService);

  // @ngInject
  function EvidenceResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      console.log(['EvidenceResource: removing', response.config.url, 'from $http cache.'].join(" "));
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/evidence_items/:evidenceId',
      {
        evidenceId: '@evidenceId'
      },
      {
        // Base Evidence Resources
        query: {
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single evidence
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
        delete: {
          method: 'DELETE',
          interceptor: {
            response: cacheInterceptor
          }
        },
        add: {
          method: 'POST',
          cache: false
        },
        apply: {
          method: 'PATCH'
        },
        // Base Evidence Refresh
        queryFresh: { // get list of evidence
          method: 'GET',
          isArray: true,
          cache: false
        },
        getFresh: { // get evidence, force cache
          method: 'GET',
          isArray: false,
          cache: false
        },

        // Evidence Comments Resources
        queryComments: {
          method: 'GET',
          url: '/api/evidence_items/:evidenceId/comments',
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/evidence_items/:evidenceId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },

        submitComment: {
          method: 'POST',
          url: '/api/evidence_items/:evidenceId/comments',
          params: {
            evidenceId: '@evidenceId'
          },
          cache: cache
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/evidence_items/:evidenceId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheInterceptor
          }
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/evidence_items/:evidenceId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheInterceptor
          }
        },

        // Evidence Comments Refresh
        queryCommentsFresh: {
          method: 'GET',
          url: 'api/evidence_items/:evidenceId/comments',
          isArray: true,
          cache: false
        },
        getCommentFresh: {
          method: 'GET',
          url: '/api/evidence_items/:evidenceId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: false
        }
      }
    )
  }

  // @ngInject
  function EvidenceService(EvidenceResource, $q, $exceptionHandler, $cacheFactory) {
    var cache = $cacheFactory.get('$http');
    // Base Evidence and Evidence Collection
    var item = {};
    var collection = [];
    var comment = {};
    var comments = [];

    // Evidence Collections
    var evidence = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        comment: comment,
        comments: comments
      },

      // Evidence Base
      add: add,
      query: query,
      get: get,
      update: update,
      delete: deleteItem,
      apply: apply,

      // Evidence Base Refresh
      queryFresh: queryFresh,
      getFresh: getFresh,

      // Evidence Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      // Evidence Comments Refresh
      queryCommentsFresh: queryCommentsFresh,
      getCommentFresh: getCommentFresh
    };

    function initBase(evidenceId) {
      return $q.all([
        get(evidenceId)
      ])
    }

    function initComments(evidenceId) {
      return $q.all([
        queryComments(evidenceId)
      ])
    }
    // Evidence Base
    function add() {
      return EvidenceResource.add().$promise
        .then(function(response) {
          // angular.copy(response, collection);
          return response.$promise;
        });
    }
    function query() {
      return EvidenceResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function get(evidenceId) {
      return EvidenceResource.get({evidenceId: evidenceId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function update(reqObj) {
      return EvidenceResource.update(reqObj).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function deleteItem(evidenceId) {
      return EvidenceResource.delete({evidenceId: evidenceId}).$promise
        .then(function(response) {
          item = null;
          return response.$promise;
        });
    }
    function apply(reqObj) {
      return EvidenceResource.apply(reqObj).$promise.then(
        function(response) { // success
          // remove evidence's cache record
          cache.remove('/api/evidence_items/' + response.id);
          get(reqObj.evidenceId);
          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        })
    }

    // Evidence Collections
    function queryEvidence(evidenceId) {
      return EvidenceResource.queryEvidence({evidenceId: evidenceId}).$promise
        .then(function(response) {
          angular.copy(response, evidence);
          return response.$promise;
        });
    }

    // Evidence Base Refresh
    function queryFresh(evidenceId) {
      return EvidenceResource.queryFresh({evidenceId: evidenceId}).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function getFresh(evidenceId) {
      return EvidenceResource.getFresh({evidenceId: evidenceId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    // Evidence Collections Refresh
    function queryEvidenceFresh(evidenceId) {
      return EvidenceResource.queryEvidenceFresh({evidenceId: evidenceId}).$promise
        .then(function(response) {
          angular.copy(response, evidence);
          return response.$promise;
        });
    }

    // Evidence Comments
    function queryComments(evidenceId) {
      return EvidenceResource.queryComments({evidenceId: evidenceId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(evidenceId, commentId) {
      return EvidenceResource.getComment({evidenceId: evidenceId, commentId: commentId}).$promise
        .then(function(response) {
          angular.copy(response, comment);
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      try {
        if(!_.has(reqObj, 'evidenceId')) {
          if(_.has(item, 'id')) { // check to see if we have a evidence with an id
            _.merge(reqObj, { evidenceId: item.id });
          } else {
            throw new Error("No evidenceId supplied or found.");
          }
        }
      } catch(e) {
        $exceptionHandler(e.message, "EvidenceService:submitComment");
      }

      return EvidenceResource.submitComment(reqObj).$promise
        .then(function(response) {
          queryCommentsFresh(reqObj.evidenceId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return EvidenceResource.updateComment(reqObj).$promise
        .then(function(response) {
          angular.copy(response, comment);
          getCommentFresh(reqObj);
          return response.$promise;
        });
    }
    function deleteComment(evidenceId, commentId) {
      return EvidenceResource.deleteComment({evidenceId: evidenceId, commentId: commentId}).$promise
        .then(function(response) {
          comment = null;
          return response.$promise;
        });
    }

    // Evidence Comments Refresh
    function queryCommentsFresh(evidenceId) {
      return EvidenceResource.queryCommentsFresh({evidenceId: evidenceId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getCommentFresh(evidenceId, commentId) {
      return EvidenceResource.getCommentFresh({evidenceId: evidenceId, commentId: commentId}).$promise
        .then(function(response) {
          angular.copy(response   , comment);
          return response.$promise;
        });
    }
  }
})();
