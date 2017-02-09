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
        subscriptions: {
          url: '/api/subscriptions',
          method: 'GET',
          isArray: false,
          cache: false
        },
        subscription: {
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
    var item = { };

    return {
      data: {
        subscriptions: item
      },
      getSubscriptions: getSubscriptions,
      unsubscribe: unsubscribe,
      subscribe: subscribe
    };

    function getSubscriptions() {
      return SubscriptionsResource.getSubscriptions().$promise
        .then(function(response) {
          angular.copy(response.records, data.subscriptions);
          return response.$promise;
        });
    }

    function unsubscribe(subscriptionId) {
      return SubscriptionsResource.unsubscribe(subscriptionId).$promise
        .then(function(response) {
          getSubscriptions();
          return response.$promise;
        });
    }
    function subscribe() {
      return SubscriptionsResource.subscribe().$promise
        .then(function(response) {
          getSubscriptions();
          return response.$promise;
        });
    }
  }
})();
