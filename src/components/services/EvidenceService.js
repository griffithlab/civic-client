(function() {
  'use strict';
  angular.module('civic.services')
    .factory('EvidenceResource', EvidenceResource)
    .factory('Evidence', EvidenceService);

  // @ngInject
  function EvidenceResource($resource, $cacheFactory) {
    var cache = $cacheFactory('evidenceCache');

    var cacheInterceptor = function(response) {
      cache.remove(response.config.url);
      return response;
    };

    return $resource('/api/evidence_items/:evidenceId',
      {
        evidenceId: '@evidenceId'
      },
      {
        add: {
          method: 'POST',
          cache: cache
        },
        query: { // get a list of all evidence
          method: 'GET',
          cache: cache
        },
        get: { // get a single variant
          method: 'GET',
          isArray: false,
          cache: cache
        },
        delete: { // get a single variant
          method: 'DELETE',
          cache: cache
        },
        update: {
          method: 'PATCH',
          interceptor: {
            response: cacheInterceptor
          }
        },
        getComments: {
          url: '/api/evidence_items/:evidenceId/comments',
          method: 'GET'
        },
        getComment: {
          url: '/api/evidence_items/:evidenceId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            commentId: '@commentId'
          },
          method: 'GET',
          isArray: false
        },
        submitComment: {
          url: '/api/evidence_items/:evidenceId/comments',
          params: {
            evidenceId: '@evidenceId'
          },
          method: 'POST'
        },
        updateComment: {
          url: '/api/evidence_items/:evidenceId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            commentId: '@commentId'
          },
          method: 'PATCH'
        },
        deleteComment: {
          url: '/api/evidence_items/:evidenceId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            commentId: '@commentId'
          },
          method: 'DELETE'
        },
        getRevisions: {
          url: '/api/evidence_items/:evidenceId/revisions',
          method: 'GET'
        },
        getRevision: {
          url: '/api/evidence_items/:evidenceId/revisions/:revisionId',
          params: {
            evidenceId: '@evidenceId',
            revisionId: '@revisionId'
          },
          method: 'GET',
          isArray: false
        },
        getLastRevision: {
          url: '/api/evidence_items/:evidenceId/revisions/last',
          params: {
            evidenceId: '@evidenceId'
          },
          method: 'GET',
          isArray: false
        },
        submitChange: {
          url: '/api/evidence_items/:evidenceId/suggested_changes',
          method: 'POST',
          cache: cache
        },
        getChanges: {
          url: '/api/evidence_items/:evidenceId/suggested_changes',
          method: 'GET'
        },
        getChange: {
          url: '/api/evidence_items/:evidenceId/suggested_changes/:changeId',
          params: {
            evidenceId: '@evidenceId',
            changeId: '@changeId'
          },
          method: 'GET',
          isArray: false
        },
        acceptChange: {
          url: '/api/evidence_items/:evidenceId/suggested_changes/:changeId/accept',
          params: {
            evidenceId: '@evidenceId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        rejectChange: {
          url: '/api/evidence_items/:evidenceId/suggested_changes/:changeId/reject',
          params: {
            evidenceId: '@evidenceId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        addChangeComment: {
          url: '/api/evidence_items/:evidenceId/suggested_changes/:changeId/comments',
          params: {
            evidenceId: '@evidenceId',
            changeId: '@changeId'
          },
          method: 'POST'
        },
        updateChangeComment: {
          url: '/api/evidence_items/:evidenceId/suggested_changes/:changeId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'PATCH'
        },
        getChangeComments: {
          url: '/api/evidence_items/:evidenceId/suggested_changes/:changeId/comments',
          params: {
            evidenceId: '@evidenceId',
            changeId: '@changeId'
          },
          method: 'GET'
        },
        getChangeComment: {
          url: '/api/evidence_items/:evidenceId/suggested_changes/:changeId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'GET',
          isArray: false
        },
        deleteChangeComment: {
          url: '/api/evidence_items/:evidenceId/suggested_changes/:changeId/comments/:commentId',
          params: {
            evidenceId: '@evidenceId',
            changeId: '@changeId',
            commentId: '@commentId'
          },
          method: 'DELETE'
        }
      });
  }

  //ngInject
  function EvidenceService(EvidenceResource) {
    return {
      // Evidence actions
      add: function(reqObj) {
        return EvidenceResource.add(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      delete: function(evidenceId) {
        return EvidenceResource.delete({evidenceId: evidenceId}).$promise
          .then(function(response) {
            return response;
          });
      },
      get: function(evidenceId) {
        return EvidenceResource.get({evidenceId: evidenceId}).$promise
          .then(function(response) {
            return response;
          });
      },
      query: function() {
        return EvidenceResource.query().$promise
          .then(function(response) {
            return response;
          });
      },
      update: function(reqObj) {
        return EvidenceResource.update(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getEvidence: function(evidenceId) {
        return EvidenceResource.getEvidence({evidenceId: evidenceId}).$promise
          .then(function(response) {
            return response;
          });
      },

      // Evidence comments
      submitComment: function(reqObj) {
        return EvidenceResource.submitComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      updateComment: function(reqObj) {
        return EvidenceResource.updateComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getComments: function(evidenceId) {
        return EvidenceResource.getComments({evidenceId: evidenceId}).$promise
          .then(function(response) {
            return response;
          });
      },
      getComment: function(reqObj) {
        return EvidenceResource.getComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      deleteComment: function(reqObj) {
        return EvidenceResource.deleteComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Evidence revisions
      getRevisions: function(evidenceId) {
        return EvidenceResource.getRevisions({evidenceId: evidenceId}).$promise
          .then(function(response) {
            return response;
          });
      },
      getRevision: function(reqObj) {
        return EvidenceResource.getRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getLastRevision: function(reqObj) {
        return EvidenceResource.getLastRevision(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Evidence suggested changes
      submitChange: function(reqObj) {
        return EvidenceResource.submitChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChanges: function(evidenceId) {
        return EvidenceResource.getChanges({evidenceId: evidenceId}).$promise
          .then(function(response) {
            return response;
          });
      },
      getChange: function(reqObj) {
        return EvidenceResource.getChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      acceptChange: function(reqObj) {
        return EvidenceResource.acceptChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      rejectChange: function(reqObj) {
        return EvidenceResource.rejectChange(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },

      // Evidence suggested changes comments
      addChangeComment: function(reqObj) {
        return EvidenceResource.addChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      updateChangeComment: function(reqObj) {
        return EvidenceResource.updateChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChangeComments: function(reqObj) {
        return EvidenceResource.getChangeComments(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      getChangeComment: function(reqObj) {
        return EvidenceResource.getChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      },
      deleteChangeComment: function(reqObj) {
        return EvidenceResource.deleteChangeComment(reqObj).$promise
          .then(function(response) {
            return response;
          });
      }
    }
  }

})();
