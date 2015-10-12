(function() {
  'use strict';
  console.log('SearchView loaded.');
  angular.module('civic.search')
    .config(SearchView);

  // @ngInject
  function SearchView($stateProvider) {
    console.log('SearchView called.');
    $stateProvider
      .state('search', {
        url: '/search',
        controller: 'SearchController',
        templateUrl: 'app/views/search/search.tpl.html',
        data: {
          titleExp: '"Search Evidence"',
          navMode: 'sub'
        }
      });
  }

})();
