angular.module('civic.login')
  .controller('LoginCtrl', LoginCtrl);

/**
 * @ngInject
 */
function LoginCtrl($log) {
  $log.info("LoginCtrl instantiated");
}