(function() {
  angular.module('civic.services')
    .factory('VariantsResource', VariantsResource)
    .factory('Variants', VariantsService);

  // @ngInject
  function VariantsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      console.log(['VariantsResource: removing', response.config.url, 'from $http cache.'].join(" "));
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/variants/:variantId',
      {
        variantId: '@variantId'
      },
      {
        // Base Variant Resources
        query: {
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single variant
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
        apply: {
          method: 'PATCH'
        },

        // Variant Collections
        queryEvidence: {
          method: 'GET',
          url: '/api/variants/:variantId/evidence_items',
          isArray: true,
          cache: cache
        },

        // Base Variant Refresh
        queryFresh: { // get list of variants
          method: 'GET',
          isArray: true,
          cache: false
        },
        getFresh: { // get variant, force cache
          method: 'GET',
          isArray: false,
          cache: false
        },

        // Base Collections Refresh
        queryEvidenceFresh: {
          method: 'GET',
          url: '/api/variants/:variantId/evidence_items',
          isArray: true,
          cache: false
        },

        // Variant Comments Resources
        queryComments: {
          method: 'GET',
          url: '/api/variants/:variantId/comments',
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },

        submitComment: {
          method: 'POST',
          url: '/api/variants/:variantId/comments',
          params: {
            variantId: '@variantId'
          },
          cache: cache
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheInterceptor
          }
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          interceptor: {
            response: cacheInterceptor
          }
        },

        // Variant Comments Refresh
        queryCommentsFresh: {
          method: 'GET',
          url: 'api/variants/:variantId/comments',
          isArray: true,
          cache: false
        },
        getCommentFresh: {
          method: 'GET',
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: false
        }
      }
    )
  }

  // @ngInject
  function VariantsService(VariantsResource, $q, $exceptionHandler, $cacheFactory) {
    var cache = $cacheFactory.get('$http');
    // Base Variant and Variant Collection
    var item = {};
    var collection = [];
    var comment = {};
    var comments = [];

    // Variant Collections
    var evidence = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        evidence: evidence,
        comment: comment,
        comments: comments
      },

      // Variant Base
      query: query,
      get: get,
      update: update,
      delete: deleteItem,
      apply: apply,

      // Variant Base Refresh
      queryFresh: queryFresh,
      getFresh: getFresh,

      // Variant Collections
      queryEvidence: queryEvidence,
      queryEvidenceFresh: queryEvidenceFresh,

      // Variant Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      // Variant Comments Refresh
      queryCommentsFresh: queryCommentsFresh,
      getCommentFresh: getCommentFresh
    };

    function initBase(variantId) {
      return $q.all([
        get(variantId),
        queryEvidence(variantId),
      ])
    }

    function initComments(variantId) {
      return $q.all([
        queryComments(variantId)
      ])
    }
    // Variant Base
    function query() {
      return VariantsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function get(variantId) {
      return VariantsResource.get({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function update(reqObj) {
      return VariantsResource.update(reqObj).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function deleteItem(variantId) {
      return VariantsResource.delete({variantId: variantId}).$promise
        .then(function(response) {
          item = null;
          return response.$promise;
        });
    }
    function apply(reqObj) {
      return VariantsResource.apply(reqObj).$promise.then(
        function(response) { // success
          // remove variant's cache record
          cache.remove('/api/variants/' + response.id);
          get(reqObj.variantId);
          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        })
    }

    // Variant Collections
    function queryEvidence(variantId) {
      return VariantsResource.queryVariants({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, evidence);
          return response.$promise;
        });
    }

    // Variant Base Refresh
    function queryFresh(variantId) {
      return VariantsResource.queryFresh({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function getFresh(variantId) {
      return VariantsResource.getFresh({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    // Variant Collections Refresh
    function queryEvidenceFresh(variantId) {
      return VariantsResource.queryVariantsFresh({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, evidence);
          return response.$promise;
        });
    }

    // Variant Comments
    function queryComments(variantId) {
      return VariantsResource.queryComments({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(variantId, commentId) {
      return VariantsResource.getComment({variantId: variantId, commentId: commentId}).$promise
        .then(function(response) {
          angular.copy(response, comment);
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      try {
        if(!_.has(reqObj, 'variantId')) {
          if(_.has(item, 'id')) { // check to see if we have a variant with an id
            _.merge(reqObj, { variantId: item.id });
          } else {
            throw new Error("No variantId supplied or found.");
          }
        }
      } catch(e) {
        $exceptionHandler(e.message, "Variantservice:submitComment");
      }

      return VariantsResource.submitComment(reqObj).$promise
        .then(function(response) {
          queryCommentsFresh(reqObj.variantId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return VariantsResource.updateComment(reqObj).$promise
        .then(function(response) {
          angular.copy(response, comment);
          getCommentFresh(reqObj);
          return response.$promise;
        });
    }
    function deleteComment(variantId, commentId) {
      return VariantsResource.deleteComment({variantId: variantId, commentId: commentId}).$promise
        .then(function(response) {
          comment = null;
          return response.$promise;
        });
    }

    // Variant Comments Refresh
    function queryCommentsFresh(variantId) {
      return VariantsResource.queryCommentsFresh({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getCommentFresh(variantId, commentId) {
      return VariantsResource.getCommentFresh({variantId: variantId, commentId: commentId}).$promise
        .then(function(response) {
          angular.copy(response   , comment);
          return response.$promise;
        });
    }
  }
})();
