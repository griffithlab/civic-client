angular.module('civic.pages')
  .controller('HomeCtrl', HomeCtrl);

/**
 * @ngInject
 */
function HomeCtrl($log) {
  $log.info("HomeCtrl instantiated");
}