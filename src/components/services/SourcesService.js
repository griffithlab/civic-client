(function() {
  'use strict';
  angular.module('civic.services')
    .factory('SourcesResource', SourcesResource)
    .factory('Sources', SourcesService);

  // @ngInject
  function SourcesResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      // console.log(['GenesResource: removing', response.config.url, 'from $http cache.'].join(' '));
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/sources',
      {},
      {
        query: {
          method: 'GET',
          isArray: true,
          cache: true
        },
        get: {
          method: 'GET',
          url: '/api/sources/:sourceId',
          isArray: false,
          cache: false
        },
        suggest: {
          method: 'POST',
          url: '/api/sources',
          isArray: false,
          cache: false
        },
        setStatus: {
          method: 'PATCH',
          url: '/api/source_suggestions/:suggestionId',
          params: {
            suggestionId: '@suggestionId'
          },
          isArray: false,
          cache: false
        },
        querySuggested: {
          method: 'GET',
          url: '/api/datatables/source_suggestions',
          params: {
            count: '@count',
            page: '@page'
          },
          isArray: false,
          cache: false
        },
        queryComments: {
          method: 'GET',
          url: '/api/sources/:sourceId/comments',
          params: {
            sourceId: '@sourceId'
          },
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/sources/:sourceId/comments/:commentId',
          params: {
            sourceId: '@sourceId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },

        submitComment: {
          method: 'POST',
          url: '/api/sources/:sourceId/comments',
          params: {
            sourceId: '@sourceId'
          },
          cache: false
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/sources/:sourceId/comments/:commentId',
          params: {
            sourceId: '@sourceId',
            commentId: '@commentId'
          },
          cache: false
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/sources/:sourceId/comments/:commentId',
          params: {
            sourceId: '@sourceId',
            commentId: '@commentId'
          },
          cache: false
        }
      }
    );
  }

  // @ngInject
  function SourcesService($cacheFactory, SourcesResource) {
    var cache = $cacheFactory.get('$http');


    var item = {};
    var collection = [];
    var suggested = [];
    var comments = [];

    return {
      data: {
        item: item,
        collection: collection,
        suggested: suggested,
        comments: comments
      },
      query: query,
      get: get,
      suggest: suggest,
      getSuggested: getSuggested,
      setStatus: setStatus,
      queryComments: queryComments,
      submitComment: submitComment,
      getComment: getComment,
      updateComment: updateComment,
      deleteComment: deleteComment
    };

    function query() {
      return SourcesResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }

    function get(sourceId) {
      return SourcesResource.get({sourceId: sourceId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }

    function suggest(reqObj) {
      return SourcesResource.suggest(reqObj).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function getSuggested(reqObj) {
      return SourcesResource.querySuggested(reqObj).$promise
        .then(function(response) {
          angular.copy(response.result, suggested);
          return response.$promise;
        });
    }

    function setStatus(reqObj) {
      return SourcesResource.setStatus(reqObj).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
    function queryComments(sourceId) {
      return SourcesResource.queryComments({sourceId: sourceId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(sourceId, commentId) {
      return SourcesResource.getComment({sourceId: sourceId, commentId: commentId}).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return SourcesResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/sources/' + reqObj.sourceId + '/comments');
          queryComments(reqObj.sourceId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return SourcesResource.updateComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/sources/' + reqObj.sourceId + '/comments');
          queryComments(reqObj.sourceId);
          return response.$promise;
        });
    }
    function deleteComment(commentId) {
      return SourcesResource.deleteComment({sourceId: item.id, commentId: commentId}).$promise
        .then(function(response) {
          cache.remove('/api/sources/' + item.id + '/comments');
          queryComments(item.id);
          return response.$promise;
        });
    }
  }
})();
