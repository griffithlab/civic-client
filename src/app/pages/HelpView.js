(function() {
  'use strict';
  angular.module('civic.pages')
    .config(helpViewConfig);

  // @ngInject
  function helpViewConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('help', {
        external: true,
        url: 'https://civic.readthedocs.io/',
      });
  }
})();
