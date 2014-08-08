angular.module('civic.services')
  .service('AuthService', AuthService);

/**
 * @ngInject
 */
function AuthService($log) {
  'use strict';
  $log.info('AuthService instantiated');
  function isAuthenticated() {
    return false;
  }

  return {
    isAuthenticated: isAuthenticated
  }
}