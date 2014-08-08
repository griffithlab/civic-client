angular.module('civic.services')
  .service('AuthService', AuthService);

/**
 * @ngInject
 */
function AuthService($log) {
  $log.info('AuthService instantiated');
}