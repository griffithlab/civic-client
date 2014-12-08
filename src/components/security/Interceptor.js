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
    return function(promise) {
      // Intercept failed requests
      return promise.then(null, function(originalResponse) {
        if(originalResponse.status === 401) {
          // The request bounced because it was not authorized - add a new request to the retry RetryQueue
          promise = RetryQueue.pushRetryFn('unauthorized-server', function retryRequest() {
            // We must use $injector to get the $http service to prevent circular dependency
            return $injector.get('$http')(originalResponse.config);
          });
        }
        return promise;
      });
    };
  }

  /**
   * @name interceptorServiceConfig
   * @desc We have to add the interceptor to the RetryQueue as a string because the interceptor depends upon service instances that are not available in the config block.
   * @param $httpProvider
   * @ngInject
   */
  function interceptorServiceConfig($httpProvider) {
    $httpProvider.responseInterceptors.push('Interceptor');
  }
})();
