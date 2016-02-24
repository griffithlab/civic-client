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
      })
      .state('search.genes', {
        url: '/genes/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/searchGenes.tpl.html',
        data: {
          titleExp: '"Search Genes"',
          navMode: 'sub'
        }
      })
      .state('search.variants', {
        url: '/variants/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/searchVariants.tpl.html',
        data: {
          titleExp: '"Search Variants"',
          navMode: 'sub'
        }
      });
  }

})();
