(function() {
  'use strict';
  angular.module('civic.services')
    .factory('EvidenceResource', EvidenceResource)
    .factory('Evidence', EvidenceService);

  // @ngInject
  function EvidenceResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      console.log(['EvidenceResource: removing', response.config.url, 'from $http cache.'].join(' '));
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
                       accept: {
                         url: '/api/evidence_items/:evidenceId/accept',
                         method: 'POST',
                         cache: false
                       },
                       revert: {
                         url: '/api/evidence_items/:evidenceId/revert',
                         method: 'POST',
                         cache: false
                       },
                       reject: {
                         url: '/api/evidence_items/:evidenceId/reject',
                         method: 'POST',
                         cache: false
                       },

                       // Evidence Collections
                       queryFlags: {
                         method: 'GET',
                         url: '/api/evidence_items/:evidenceId/flags',
                         isArray: false,
                         cache: cache
                       },
                       submitFlag: {
                         method: 'POST',
                         url: '/api/evidence_items/:evidenceId/flags',
                         cache: false
                       },
                       resolveFlag: {
                         method: 'PATCH',
                         url: '/api/evidence_items/:evidenceId/flags/:flagId',
                         params: {
                           evidenceId: '@evidenceId',
                           flagId: '@flagId'
                         },
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
                         cache: false
                       },
                       deleteComment: {
                         method: 'DELETE',
                         url: '/api/evidence_items/:evidenceId/comments/:commentId',
                         params: {
                           evidenceId: '@evidenceId',
                           commentId: '@commentId'
                         },
                         cache: false
                       }
                     }
                    );
  }

  // @ngInject
  function EvidenceService(EvidenceResource, Variants, Genes, Subscriptions, $q, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // Base Evidence and Evidence Collection
    var item = {};
    var collection = [];

    var comments = [];

    // Evidence Collections
    var flags = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        comments: comments,
        flags: flags
      },

      // Evidence Base
      add: add,
      query: query,
      get: get,
      update: update,
      delete: deleteItem,
      apply: apply,
      accept: accept,
      revert: revert,
      reject: reject,

      // Evidence Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      // Evidence Collections
      queryFlags: queryFlags,
      submitFlag: submitFlag,
      resolveFlag: resolveFlag
    };

    function initBase(evidenceId) {
      return $q.all([
        get(evidenceId),
        queryFlags(evidenceId)
      ]);
    }

    function initComments(evidenceId) {
      return $q.all([
        queryComments(evidenceId)
      ]);
    }
    // Evidence Base
    function add(reqObj) {
      return EvidenceResource.add(reqObj).$promise
        .then(function(response) {
          // flush cached variant, variant groups, and evidence item lists
          cache.remove('/api/variants/' + response.variant.id);
          cache.remove('/api/variants/' + response.variant.id + '/evidence_items');
          cache.remove('/api/genes/' + response.gene.id + '/variant_groups');

          // flush gene variants and refresh (for variant menu)
          cache.remove('/api/genes/' + reqObj.gene.id + '/variants?count=999');
          Genes.queryVariants(reqObj.gene.id);
          Genes.queryVariantGroups(reqObj.gene.id);

          return response.$promise;
        });
    }
    function accept(evidenceId, variantId, actionOrg) {
      return EvidenceResource.accept({ evidenceId: evidenceId, organization: actionOrg }).$promise
        .then(function(response) {
          // flush cached variant and evidence item lists
          cache.remove('/api/evidence_items/' + response.id);
          cache.remove('/api/variants/' + variantId);
          cache.remove('/api/variants/' + variantId + '/evidence_items');
          cache.remove('/api/genes/' + response.gene_id + '/variant_groups');
          get(response.id);
          Variants.get(variantId);

          // flush gene variants and refresh (for variant menu)
          cache.remove('/api/genes/' + response.gene_id + '/variants?count=999');
          Genes.queryVariants(response.gene_id);
          Genes.queryVariantGroups(response.gene_id);

          return response.$promise;
        });
    }
    function reject(evidenceId, variantId, actionOrg) {
      return EvidenceResource.reject({ evidenceId: evidenceId, organization: actionOrg }).$promise
        .then(function(response) {
          // flush cached variant and evidence item lists
          cache.remove('/api/evidence_items/' + response.id);
          cache.remove('/api/variants/' + variantId);
          cache.remove('/api/variants/' + variantId + '/evidence_items');
          cache.remove('/api/genes/' + response.gene_id + '/variant_groups');
          get(response.id);
          Variants.get(variantId);

          // flush gene variants and refresh (for variant menu)
          cache.remove('/api/genes/' + response.gene_id + '/variants?count=999');
          Genes.queryVariants(response.gene_id);
          Genes.queryVariantGroups(response.gene_id);

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
        });
    }
    function revert(reqObj) {
      return EvidenceResource.revert(reqObj).$promise.then(
        function(response) { // success
          // flush cached variant and evidence item lists
          cache.remove('/api/evidence_items/' + response.id);
          cache.remove('/api/variants/' + response.variant_id);
          cache.remove('/api/variants/' + response.variant_id + '/evidence_items');
          cache.remove('/api/genes/' + response.gene_id + '/variant_groups');
          // refresh evidence item
          get(response.id);
          // refresh variant
          Variants.get(response.variant_id);
          // refresh variant evidence
          Variants.queryEvidence(response.variant_id);

          // flush gene variants and refresh (for variant menu)
          cache.remove('/api/genes/' + response.gene_id + '/variants?count=999');
          Genes.queryVariants(response.gene_id);
          Genes.queryVariantGroups(response.gene_id);

          // flush all associated assertions
          _.each(response.assertions, function(assertion) {
            cache.remove('/api/assertions/' + assertion.id);
          });

          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        });
    }

    // Evidence Collections
    function queryFlags(evidenceId) {
      return EvidenceResource.queryFlags({evidenceId: evidenceId}).$promise
        .then(function(response) {
          angular.copy(response.records, flags);
          return response.$promise;
        });
    }
    function submitFlag(reqObj) {
      reqObj.evidenceId = reqObj.entityId;
      return EvidenceResource.submitFlag(reqObj).$promise
        .then(function(response) {
          var evidenceId = response.state_params.evidence_item.id;
          var variantId = response.state_params.variant.id;
          cache.remove('/api/evidence_items/' + evidenceId + '/flags');
          queryFlags(evidenceId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          // flush cached variant and evidence item lists
          cache.remove('/api/evidence_items/' + evidenceId);
          cache.remove('/api/variants/' + variantId);
          cache.remove('/api/variants/' + variantId + '/evidence_items');

          // refresh evidence item
          get(evidenceId);
          // refresh variant
          Variants.get(variantId);
          // refresh variant evidence
          Variants.queryEvidence(variantId);

          return response.$promise;
        });
    }
    function resolveFlag(reqObj) {
      reqObj.evidenceId = reqObj.entityId;
      reqObj.state = 'resolved';
      return EvidenceResource.resolveFlag(reqObj).$promise
        .then(function(response) {
          var evidenceId = response.state_params.evidence_item.id;
          var variantId = response.state_params.variant.id;
          cache.remove('/api/evidence_items/' + reqObj.evidenceId + '/flags');
          queryFlags(reqObj.evidenceId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          // flush cached variant and evidence item lists
          cache.remove('/api/evidence_items/' + evidenceId);
          cache.remove('/api/variants/' + variantId);
          cache.remove('/api/variants/' + variantId + '/evidence_items');

          // refresh evidence item
          get(evidenceId);
          // refresh variant
          Variants.get(variantId);
          // refresh variant evidence
          Variants.queryEvidence(variantId);

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
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return EvidenceResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/evidence_items/' + reqObj.evidenceId + '/comments');
          queryComments(reqObj.evidenceId);

          // flush subscriptions and refresh
          cache.remove('/api/subscriptions?count=999');
          Subscriptions.query();

          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return EvidenceResource.updateComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/evidence_items/' + reqObj.evidenceId + '/comments/' + reqObj.commentId);
          queryComments(reqObj.evidenceId);
          return response.$promise;
        });
    }
    function deleteComment(commentId) {
      return EvidenceResource.deleteComment({evidenceId: item.id, commentId: commentId}).$promise
        .then(function(response) {
          cache.remove('/api/evidence_items/' + item.id + '/comments');
          queryComments(item.id);
          return response.$promise;
        });
    }
  }
})();
