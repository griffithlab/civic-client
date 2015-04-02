(function() {
  'use strict';
  angular.module('civic.services')
    .factory('GenesResource', GenesResource)
    .factory('Genes', GenesService);

  // @ngInject
  function GenesResource($resource, $cacheFactory, _, $log) {
    var cache = $cacheFactory('genesCache');

    var cacheInterceptor =function(response) {
      cache.remove(response.config.url);
      return response;
    };

    return $resource('/api/genes/:geneId',
      {
        geneId: '@entrez_id'
      },
      {
        query: { // get a list of all genes
          method: 'GET',
          cache: cache
        },
        get: { // get a single gene
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
          url: '/api/genes/:geneId/comments',
          method: 'GET'
        },
        getComment: {
          url: '/api/genes/:geneId/comments/:commentId',
          params: {
            geneId: '@geneId',
            commentId: '@commentId'
          },
          method: 'GET',
          isArray: false
        },
        addComment: {
          url: '/api/genes/:geneId/comments',
          params: {
            geneId: '@geneId'
          },
          method: 'POST'
        },
        getRevisions: {
          url: '/api/genes/:geneId/revisions',
          method: 'GET'
        },
        getRevision: {
          url: '/api/genes/:geneId/revisions/:revisionId',
          params: {
            geneId: '@geneId',
            revisionId: '@revisionId'
          },
          method: 'GET',
          isArray: false
        },
        getSuggestedChanges: {
          url: '/api/genes/:geneId/suggested_changes',
          method: 'GET'
        },
        getSuggestedChange: {
          url: '/api/genes/:geneId/suggested_changes/:changeId',
          params: {
            geneId: '@geneId',
            changeId: '@changeId'
          },
          method: 'GET',
          isArray: false
        }

      });
  }

  //ngInject
  function GenesService(GenesResource) {
    return {
      get: function(entrez_id) {
        return GenesResource.get({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      query: function() {
        return GenesResource.query().$promise
          .then(function(response) {
            return response;
          });
      },
      update: function(reqObj) {
        return GenesResource.update(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      addComment: function(reqObj) {
        return GenesResource.addComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getComments: function(entrez_id) {
        return GenesResource.getComments({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getComment: function(reqObj) {
        return GenesResource.getComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getRevisions: function(entrez_id) {
        return GenesResource.getRevisions({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getRevision: function(reqObj) {
        return GenesResource.getRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getSuggestedChanges: function(entrez_id) {
        return GenesResource.getSuggestedChanges({geneId: entrez_id}).$promise
          .then(function(response) {
            return response;
          });
      },
      getSuggestedChange: function(reqObj) {
        return GenesResource.getSuggestedChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
