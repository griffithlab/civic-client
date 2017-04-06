(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantGroupsResource', VariantGroupsResource)
    .factory('VariantGroups', VariantGroupsService);

  // @ngInject
  function VariantGroupsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      console.log(['VariantGroupsResource: removing', response.config.url, 'from $http cache.'].join(' '));
      cache.remove(response.config.url);
      return response;
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
        get: {
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
        add: {
          method: 'POST',
          cache: false
        },

        // VariantGroup Collections Resources
        queryVariants: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/variants',
          isArray: true,
          cache: cache
        },
        queryFlags: {
          method: 'GET',
          url: '/api/variant_groups/:variantGroupId/flags',
          isArray: false,
          cache: cache
        },
        submitFlag: {
          method: 'POST',
          url: '/api/variant_groups/:variantGroupId/flags',
          cache: false
        },
        resolveFlag: {
          method: 'PATCH',
          url: '/api/variant_groups/:variantGroupId/flags/:flagId',
          params: {
            variantGroupId: '@variantGroupId',
            flagId: '@flagId'
          },
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
          cache: false
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/variant_groups/:variantGroupId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            commentId: '@commentId'
          },
          cache: false
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/variant_groups/:variantGroupId/comments/:commentId',
          params: {
            variantGroupId: '@variantGroupId',
            commentId: '@commentId'
          },
          cache: false
        }
      }
    );
  }

  // @ngInject
  function VariantGroupsService(VariantGroupsResource, Subscriptions, $q, $cacheFactory) {
    var cache = $cacheFactory.get('$http');
    // Base VariantGroup and VariantGroup Collection
    var item = {};
    var collection = [];

    // VariantGroup Collections
    var variants = [];
    var comments = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        variants: variants,
        comments: comments
      },

      // VariantGroup Base
      query: query,
      get: get,
      update: update,
      delete: deleteItem,
      apply: apply,
      add: add,

      // VariantGroup Collections
      queryVariants: queryVariants,
      queryFlags: queryFlags,
      submitFlag: submitFlag,
      resolveFlag: resolveFlag,

      // VariantGroup Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment

    };

    function initBase(variantGroupId) {
      return $q.all([
        get(variantGroupId),
        queryVariants(variantGroupId),
        queryFlags(variantGroupId)
      ]);
    }

    function initComments(variantGroupId) {
      return $q.all([
        queryComments(variantGroupId)
      ]);
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
          cache.remove('/api/variant_groups/' + response.id);
          get(reqObj.variantGroupId);
          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        });
    }
    function add(reqObj) {
      return VariantGroupsResource.add(reqObj).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    // VariantGroup Collections
    function queryVariants() {
      console.warn('returning copy of variantGroups.variants');
      return $q.when(variants);
      //return VariantGroupsResource.queryVariants({variantGroupId: variantGroupId}).$promise
      //  .then(function(response) {
      //    angular.copy(response, variants);
      //    return response.$promise;
      //  });
    }

    function queryFlags(variantGroupId) {
      return VariantGroupsResource.queryFlags({variantGroupId: variantGroupId}).$promise
        .then(function(response) {
          angular.copy(response.records, flags);
          return response.$promise;
        });
    }
    function submitFlag(reqObj) {
      reqObj.variantGroupId = reqObj.entityId;
      return VariantGroupsResource.submitFlag(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/variant_groups/' + reqObj.variantGroupId + '/flags');
          queryFlags(reqObj.variantGroupId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }
    function resolveFlag(reqObj) {
      reqObj.variantGroupId = reqObj.entityId;
      reqObj.state = 'resolved';
      return VariantGroupsResource.resolveFlag(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/variant_groups/' + reqObj.variantGroupId + '/flags');
          queryFlags(reqObj.variantGroupId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
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
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return VariantGroupsResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/variant_groups/' + reqObj.variantGroupId + '/comments');
          queryComments(reqObj.variantGroupId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return VariantGroupsResource.updateComment(reqObj).$promise
        .then(function(response) {
          // TODO: delete comment from cache, refresh comments
          return response.$promise;
        });
    }
    function deleteComment(commentId) {
      return VariantGroupsResource.deleteComment({variantGroupId: item.id, commentId: commentId}).$promise
        .then(function(response) {
          cache.remove('/api/variant_groups/' + item.id + '/comments');
          queryComments(item.id);
          return response.$promise;
        });
    }
  }
})();
