(function() {
  'use strict';
  angular.module('civic.services')
    .factory('SubscriptionsResource', SubscriptionsResource)
    .factory('Subscriptions', SubscriptionsService);

  // @ngInject
  function SubscriptionsResource($resource) {

    return $resource('',
      { },
      {
        query: {
          url: '/api/subscriptions',
          params: {
            count: 999
          },
          method: 'GET',
          isArray: false,
          cache: false
        },
        get: {
          url: '/api/subscriptions/:subscriptionId',
          params: {
            subscriptionId: '@subscriptionId'
          },
          method: 'GET',
          isArray: false,
          cache: false
        },
        unsubscribe: {
          url: '/api/subscriptions/:subscriptionId',
          method: 'DELETE',
          isArray: false,
          cache: false
        },
        subscribe: {
          url: '/api/subscriptions',
          method: 'POST',
          cache: false
        }
      }
    );
  }

  // @ngInject
  function SubscriptionsService(SubscriptionsResource) {
    var collection = [];
    var item = {};
    return {
      data: {
        item: item,
        collection: collection
      },
      query: query,
      get: get,
      unsubscribe: unsubscribe,
      subscribe: subscribe
    };

    function query() {
      return SubscriptionsResource.query().$promise
        .then(function(response) {
          angular.copy(response.records, collection);
          return response.$promise;
        });
    }

    function get(subscriptionId) {
      return SubscriptionsResource.get({subscriptionId: subscriptionId}).$promise
        .then(function(response) {
          angular.copy(response.records, item);
          return response.$promise;
        });
    }

    function unsubscribe(subscriptionId) {
      return SubscriptionsResource.unsubscribe(subscriptionId).$promise
        .then(function(response) {
          query();
          return response.$promise;
        });
    }
    function subscribe() {
      return SubscriptionsResource.subscribe().$promise
        .then(function(response) {
          query();
          return response.$promise;
        });
    }
  }
})();
