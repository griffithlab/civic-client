(function() {
  angular.module('civic.services')
    .factory('VariantGroupsResource', VariantGroupsResource)
    .factory('VariantGroups', VariantGroupsService);

  // @ngInject
  function VariantGroupsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      console.log(['VariantGroupsResource: removing', response.config.url, 'from $http cache.'].join(" "));
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/variant_groups/:variantGroupId',
      {
        variantGroupId: '@variantGroupId'
      },
      {
        // Base VariantGroup Resources
        query: {
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: { // get a single variantGroup
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

        // VariantGroup Collections
        queryVariants: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/variants',
          isArray: true,
          cache: cache
        },

        // Base VariantGroup Refresh
        queryFresh: { // get list of variantGroups
          method: 'GET',
          isArray: true,
          cache: false
        },
        getFresh: { // get variantGroup, force cache
          method: 'GET',
          isArray: false,
          cache: false
        },

        // Base Collections Refresh
        queryVariantsFresh: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/variants',
          isArray: true,
          cache: false
        },

        // VariantGroup Comments Resources
        queryComments: {
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

        // VariantGroup Comments Refresh
        queryCommentsFresh: {
          method: 'GET',
          url: 'api/variant_groups/:variantGroupId/comments',
          isArray: true,
          cache: false
        },
        getCommentFresh: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: false
        }
      }
    )
  }

  // @ngInject
  function VariantGroupsService(VariantGroupsResource, $q, $exceptionHandler, $cacheFactory) {
    var cache = $cacheFactory.get('$http');
    // Base VariantGroup and VariantGroup Collection
    var item = {};
    var collection = [];

    // VariantGroup Collections
    var variants = [];
    var variantGroups = [];
    var comment = {};
    var comments = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,

        variants: variants,

        comment: comment,
        comments: comments
      },

      // VariantGroup Base
      query: query,
      get: get,
      update: update,
      delete: deleteItem,
      apply: apply,

      // VariantGroup Base Refresh
      queryFresh: queryFresh,
      getFresh: getFresh,

      // VariantGroup Collections
      queryVariants: queryVariants,

      // VariantGroup Collections Refresh
      queryVariantsFresh: queryVariantsFresh,

      // VariantGroup Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      // VariantGroup Comments Refresh
      queryCommentsFresh: queryCommentsFresh,
      getCommentFresh: getCommentFresh
    };

    function initBase(variantGroupId) {
      return $q.all([
        get(variantGroupId),
        queryVariants(variantGroupId)
      ])
    }

    function initComments(variantGroupId) {
      return $q.all([
        queryComments(variantGroupId)
      ])
    }
    // VariantGroup Base
    function query() {
      return VariantGroupsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function get(variantGroupId) {
      return VariantGroupsResource.get({variantGroupId: variantGroupId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          angular.copy(response.variants, variants);
          return response.$promise;
        });
    }
    function update(reqObj) {
      return VariantGroupsResource.update(reqObj).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function deleteItem(variantGroupId) {
      return VariantGroupsResource.delete({variantGroupId: variantGroupId}).$promise
        .then(function(response) {
          item = null;
          return response.$promise;
        });
    }
    function apply(reqObj) {
      return VariantGroupsResource.apply(reqObj).$promise.then(
        function(response) { // success
          // remove variantGroup's cache record
          cache.remove('/api/variant_groups/' + response.id);
          get(reqObj.variantGroupId);
          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        })
    }

    // VariantGroup Collections
    function queryVariants(variantGroupId) {
      console.warn('returning copy of variantGroups.variants');
      return $q.when(variants);
      //return VariantGroupsResource.queryVariants({variantGroupId: variantGroupId}).$promise
      //  .then(function(response) {
      //    angular.copy(response, variants);
      //    return response.$promise;
      //  });
    }

    // VariantGroup Base Refresh
    function queryFresh(variantGroupId) {
      return VariantGroupsResource.queryFresh({variantGroupId: variantGroupId}).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function getFresh(variantGroupId) {
      return VariantGroupsResource.getFresh({variantGroupId: variantGroupId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    // VariantGroup Collections Refresh
    function queryVariantsFresh(variantGroupId) {
      return $q.when(variants);
      console.warn('returning copy of variantGroups.variants');
      //return VariantGroupsResource.queryVariantsFresh({variantGroupId: variantGroupId}).$promise
      //  .then(function(response) {
      //    angular.copy(response, variants);
      //    return response.$promise;
      //  });
    }

    // VariantGroup Comments
    function queryComments(variantGroupId) {
      return VariantGroupsResource.queryComments({variantGroupId: variantGroupId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(variantGroupId, commentId) {
      return VariantGroupsResource.getComment({variantGroupId: variantGroupId, commentId: commentId}).$promise
        .then(function(response) {
          angular.copy(response, comment);
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return VariantGroupsResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/variant_groups/' + reqObj.variantGroupId + '/comments');
          queryComments(reqObj.variantGroupId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return VariantGroupsResource.updateComment(reqObj).$promise
        .then(function(response) {
          angular.copy(response, comment);
          getCommentFresh(reqObj);
          return response.$promise;
        });
    }
    function deleteComment(variantGroupId, commentId) {
      return VariantGroupsResource.deleteComment({variantGroupId: variantGroupId, commentId: commentId}).$promise
        .then(function(response) {
          comment = null;
          return response.$promise;
        });
    }

    // VariantGroup Comments Refresh
    function queryCommentsFresh(variantGroupId) {
      return VariantGroupsResource.queryCommentsFresh({variantGroupId: variantGroupId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getCommentFresh(variantGroupId, commentId) {
      return VariantGroupsResource.getCommentFresh({variantGroupId: variantGroupId, commentId: commentId}).$promise
        .then(function(response) {
          angular.copy(response   , comment);
          return response.$promise;
        });
    }
  }
})();
