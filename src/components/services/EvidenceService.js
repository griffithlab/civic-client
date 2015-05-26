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
          method: 'PATCH',
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
          cache: false
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
        }

      }
    )
  }

  // @ngInject
  function EvidenceService(EvidenceResource, $q, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // Base Evidence and Evidence Collection
    var item = {};
    var collection = [];

    // Evidence Collections
    var comments = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        comments: comments
      },

      // Evidence Base
      add: add,
      query: query,
      get: get,
      update: update,
      delete: deleteItem,
      apply: apply,

      // Evidence Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment
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
    function add(reqObj) {
      return EvidenceResource.add(reqObj).$promise
        .then(function(response) {
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
          cache.remove('/api/evidence_items/' + response.id);
          get(reqObj.evidenceId);
          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        })
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
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return EvidenceResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/evidence_items/' + reqObj.evidenceId + '/comments');
          queryComments(reqObj.evidenceId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return EvidenceResource.updateComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/evidence_items/' + reqObj.evidenceId + '/comments');
          queryComments(reqObj.evidenceId);
          return response.$promise;
        });
    }
    function deleteComment(evidenceId, commentId) {
      return EvidenceResource.deleteComment({evidenceId: evidenceId, commentId: commentId}).$promise
        .then(function(response) {
          cache.remove('/api/evidence_items/' + evidenceId + '/comments');
          queryComments(evidenceId);
          return response.$promise;
        });
    }
  }
})();
