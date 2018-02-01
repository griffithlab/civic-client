(function() {
  'use strict';
  angular.module('civic.services')
    .factory('AssertionsResource', AssertionsResource)
    .factory('Assertions', AssertionsService);

  // @ngInject
  function AssertionsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    return $resource('/api/assertions', {}, {
      query: {
        url: '/api/assertions',
        method: 'GET',
        isArray: true,
        cache: cache
      },
      get: {
        url: '/api/assertions/:assertionId',
        method: 'GET',
        isArray: false,
        cache: cache
      },
      add: {
        method: 'POST',
        cache: false
      },
      accept: {
        url: '/api/assertions/:assertionId/accept',
        params: {
          assertionId: '@assertionId'
        },
        method: 'POST',
        cache: false
      },
      reject: {
        url: '/api/assertions/:assertionId/reject',
        params: {
          assertionId: '@assertionId'
        },
        method: 'POST',
        cache: false
      },
      queryAcmgCodes: {
        url: '/api/acmg_codes',
        method: 'GET',
        isArray: true,
        cache: true
      },
      apply: {
        method: 'PATCH',
        cache: false
      },
      queryFlags: {
        method: 'GET',
        url: '/api/assertions/:assertionId/flags',
        isArray: false,
        cache: cache
      },
      submitFlag: {
        method: 'POST',
        url: '/api/assertions/:assertionId/flags',
        params: {
          assertionId: '@assertionId'
        },
        cache: false
      },
      resolveFlag: {
        method: 'PATCH',
        url: '/api/assertions/:assertionId/flags/:flagId',
        params: {
          assertionId: '@assertionId',
          flagId: '@flagId'
        },
        cache: false
      },

      // Assertion Comments Resources
      queryComments: {
        method: 'GET',
        url: '/api/assertions/:assertionId/comments',
        isArray: true,
        cache: cache
      },
      getComment: {
        method: 'GET',
        url: '/api/assertions/:assertionId/comments/:commentId',
        params: {
          assertionId: '@assertionId',
          commentId: '@commentId'
        },
        isArray: false,
        cache: cache
      },

      submitComment: {
        method: 'POST',
        url: '/api/assertions/:assertionId/comments',
        params: {
          assertionId: '@assertionId'
        },
        cache: false
      },
      updateComment: {
        method: 'PATCH',
        url: '/api/assertions/:assertionId/comments/:commentId',
        params: {
          assertionId: '@assertionId',
          commentId: '@commentId'
        },
        cache: false
      },
      deleteComment: {
        method: 'DELETE',
        url: '/api/assertions/:assertionId/comments/:commentId',
        params: {
          assertionId: '@assertionId',
          commentId: '@commentId'
        },
        cache: false
      },
      // My Variant Info
      getMyVariantInfo: {
        url: '/api/variants/:variantId/myvariant_info_proxy',
        params: {
          variantId: '@variantId'
        },
        cache: cache
      }
    });
  }

  // @ngInject
  function AssertionsService(AssertionsResource, $cacheFactory, $q, Subscriptions) {
    var cache = $cacheFactory.get('$http');

    // Base Assertion
    var collection = {};
    var item = {};
    var acmg_codes = [];

    var myVariantInfo = {};

    // Collections
    var comments = [];
    var flags = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        myVariantInfo: myVariantInfo,
        collection: collection,
        acmg_codes: acmg_codes,
        flags: flags,
        comments: comments
      },
      // Assertion Base
      query: query,
      get: get,
      add: add,
      accept: accept,
      reject: reject,

      // Additional Info
      queryAcmgCodes: queryAcmgCodes,
      getMyVariantInfo: getMyVariantInfo,

      // Collections
      queryFlags: queryFlags,
      submitFlag: submitFlag,
      resolveFlag: resolveFlag,

      // Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment
    };

    function initBase(assertionId) {
      return $q.all([
        get(assertionId),
        queryFlags(assertionId)
      ]);
    }

    function initComments(assertionId) {
      return $q.all([
        queryComments(assertionId)
      ]);
    }

    function query() {
      return AssertionsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(id) {
      return AssertionsResource.get({
          assertionId: id
        }).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function add(reqObj) {
      return AssertionsResource.add(reqObj).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function accept(id) {
      return AssertionsResource.accept({
          assertionId: id
        }).$promise
        .then(function(response) {
          // flush cached assertion and variant
          cache.remove('/api/assertions');
          cache.remove('/api/assertions/' + response.id);
          cache.remove('/api/variants/' + response.variant.id);

          // reload assertion
          get(response.id);

          return response.$promise;
        });
    }

    function reject(id) {
      return AssertionsResource.reject({
          assertionId: id
        }).$promise
        .then(function(response) {
          // flush cached assertion and variant
          cache.remove('/api/assertions');
          cache.remove('/api/assertions/' + response.id);
          cache.remove('/api/variants/' + response.variant.id);

          // reload assertion
          get(response.id);

          return response.$promise;
        });
    }

    function queryAcmgCodes() {
      return AssertionsResource.queryAcmgCodes().$promise
        .then(function(response) {
          angular.copy(response, acmg_codes);
          return response.$promise;
        });
    }

    function getMyVariantInfo(variantId) {
      return AssertionsResource.getMyVariantInfo({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, myVariantInfo);
          return response.$promise;
        });
    }

    function queryFlags(assertionId) {
      return AssertionsResource.queryFlags({assertionId: assertionId}).$promise
        .then(function(response) {
          angular.copy(response.records, flags);
          return response.$promise;
        });
    }

    function submitFlag(reqObj) {
      reqObj.assertionId = reqObj.entityId;
      return AssertionsResource.submitFlag(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/assertions/' + reqObj.assertionId + '/flags');
          queryFlags(reqObj.assertionId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }
    function resolveFlag(reqObj) {
      reqObj.assertionId = reqObj.entityId;
      reqObj.state = 'resolved';
      return AssertionsResource.resolveFlag(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/assertions/' + reqObj.assertionId + '/flags');
          queryFlags(reqObj.assertionId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }

    function queryComments(assertionId) {
      return AssertionsResource.queryComments({
        assertionId: assertionId
      }).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }

    function getComment(assertionId, commentId) {
      return AssertionsResource.getComment({
        assertionId: assertionId,
        commentId: commentId
      }).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function submitComment(reqObj) {
      return AssertionsResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/assertions/' + reqObj.assertionId + '/comments');
          queryComments(reqObj.assertionId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }

    function updateComment(reqObj) {
      return AssertionsResource.updateComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/assertions/' + reqObj.assertionId + '/comments');
          queryComments(reqObj.assertionId);
          return response.$promise;
        });
    }

    function deleteComment(commentId) {
      return AssertionsResource.deleteComment({
        assertionId: item.id,
        commentId: commentId
      }).$promise
        .then(function(response) {
          cache.remove('/api/assertions/' + item.id + '/comments');
          queryComments(item.id);
          return response.$promise;
        });
    }
  }
})();
