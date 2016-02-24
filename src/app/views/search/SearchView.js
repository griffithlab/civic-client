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
        abstract: true,
        url: '/search',
        templateUrl: 'app/views/search/search.tpl.html'
      })
      .state('search.evidence', {
        url: '/evidence/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/searchEvidence.tpl.html',
        data: {
          titleExp: '"Search Evidence"',
          navMode: 'sub'
        }
      });
  }

})();
