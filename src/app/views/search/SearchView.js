(function() {
  'use strict';
  console.log('SearchView loaded.');
  angular.module('civic.search')
    .controller('SearchViewController', SearchViewController)
    .config(SearchView);

  // @ngInject
  function SearchView($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('search', {
        abstract: true,
        url: '/search',
        controller: 'SearchViewController',
        templateUrl: 'app/views/search/search.tpl.html',
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
      .state('search.assertions', {
        url: '/assertions/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/searchAssertions.tpl.html',
        data: {
          titleExp: '"Search Assertions"',
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
      .state('search.suggested_changes', {
        url: '/suggested_changes/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/searchSuggestedChanges.tpl.html',
        data: {
          titleExp: '"Search Suggested Changes"',
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
      })
      .state('search.sources', {
        url: '/sources/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/searchSources.tpl.html',
        data: {
          titleExp: '"Search Sources"',
          navMode: 'sub'
        }
      })
      .state('search.variantGroups', {
        url: '/variantGroups/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/searchVariantGroups.tpl.html',
        data: {
          titleExp: '"Search Variant Groups"',
          navMode: 'sub'
        }
      });

    // redirect root /search requests to /search/evidence
    $urlRouterProvider.when('/search', '/search/evidence/:token');

  }

  // @ngInject
  function SearchViewController($scope, $state) {
    $scope.$watch(function() { return $state.current.name; }, function(state) {
      $scope.state = state;
    });
  }

})();
