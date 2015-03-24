(function() {
  'use strict';
  angular.module('civic.browse')
    .config(BrowseViewConfig);

  // @ngInject
  function BrowseViewConfig($stateProvider) {
    $stateProvider
      .state('browse', {
        url: '/browse',
        controller: 'BrowseController',
        templateUrl: 'app/views/browse/browse.tpl.html',
        data: {
          titleExp: '"Browse CIViC"',
          navMode: 'sub'
        }
      });
  }

})();
