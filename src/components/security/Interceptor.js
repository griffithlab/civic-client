(function() {
  'use strict';
  angular.module('civic.security.interceptor', ['civic.security.retryQueue'])
    .factory('Interceptor', Interceptor)
    .config(interceptorServiceConfig);

  /**
   * @name Interceptor
   * @desc listens for authentication failures
   * @param $injector
   * @param RetryQueue
   * @returns {Function}
   * @ngInject
   */
  function Interceptor($injector, RetryQueue) {
    return {
      response: function(response) { // success - just pass the response through
        return response;
      },
      responseError: function(response) {
        // The request bounced because it was not authorized - add a new request to the retry RetryQueue
        var $q = RetryQueue.pushRetryFn('unauthorized-server', function retryRequest() {
          // We must use $injector to get the $http service to prevent circular dependency
          return $injector.get('$http')(response.config);
        });
        return response || $q.when(response);
        //return response;
      }
    };

  }

  /**
   * @name interceptorServiceConfig
   * @desc We have to add the interceptor to the RetryQueue as a string because the interceptor depends upon service instances that are not available in the config block.
   * @param $httpProvider
   * @ngInject
   */
  function interceptorServiceConfig($httpProvider) {
    // $httpProvider.interceptors.push('Interceptor');
  }
})();
