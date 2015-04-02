(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantsResource', VariantsResource)
    .factory('Variants', VariantsService);

  // @ngInject
  function VariantsResource($resource, $cacheFactory) {
    var cache = $cacheFactory('variantsCache');

    var cacheInterceptor =function(response) {
      cache.remove(response.config.url);
      return response;
    };

    return $resource('/api/variants/:variantId',
      {
        variantId: '@entrez_id'
      },
      {
        query: { // get a list of all variants
          method: 'GET',
          cache: cache
        },
        get: { // get a single variant
          method: 'GET',
          isArray: false,
          cache: cache
        },
        update: {
          method: 'PUT',
          interceptor: {
            response: cacheInterceptor
          }
        },
        getComments: {
          url: '/api/variants/:variantId/comments',
          method: 'GET'
        },
        getComment: {
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          method: 'GET',
          isArray: false
        },
        addComment: {
          url: '/api/variants/:variantId/comments',
          params: {
            variantId: '@variantId'
          },
          method: 'POST'
        },
        deleteComment: {
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            geneId: '@variantId',
            commentId: '@commentId'
          },
          method: 'DELETE'
        },
        getRevisions: {
          url: '/api/variants/:variantId/revisions',
          method: 'GET'
        },
        getRevision: {
          url: '/api/variants/:variantId/revisions/:revisionId',
          params: {
            variantId: '@variantId',
            revisionId: '@revisionId'
          },
          method: 'GET',
          isArray: false
        },
        getSuggestedChanges: {
          url: '/api/variants/:variantId/suggested_changes',
          method: 'GET'
        },
        getSuggestedChange: {
          url: '/api/variants/:variantId/suggested_changes/:changeId',
          params: {
            variantId: '@variantId',
            changeId: '@changeId'
          },
          method: 'GET',
          isArray: false
        }

      });
  }

  //ngInject
  function VariantsService(VariantsResource) {
    return {
      get: function(entrez_id) {
        return VariantsResource.get({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      query: function() {
        return VariantsResource.query().$promise
          .then(function(response) {
            return response;
          });
      },
      update: function(reqObj) {
        return VariantsResource.update(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      addComment: function(reqObj) {
        return VariantsResource.addComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getComments: function(entrez_id) {
        return VariantsResource.getComments({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getComment: function(reqObj) {
        return VariantsResource.getComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      deleteComment: function(reqObj) {
        return VariantsResource.getComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getRevisions: function(entrez_id) {
        return VariantsResource.getRevisions({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getRevision: function(reqObj) {
        return VariantsResource.getRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getSuggestedChanges: function(entrez_id) {
        return VariantsResource.getSuggestedChanges({variantId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getSuggestedChange: function(reqObj) {
        return VariantsResource.getSuggestedChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
