(function() {
  'use strict';
  console.log('SearchView loaded.');
  angular.module('civic.search')
    .controller('SearchViewController', SearchViewController)
    .config(SearchView);

  // @ngInject
  function SearchView($stateProvider) {
    $stateProvider
      .state('search', {
        abstract: true,
        url: '/search',
        controller: 'SearchViewController',
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
      .state('search.assertions', {
        url: '/assertions/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/searchAssertions.tpl.html',
        resolve: {
          Assertions: 'Assertions',
          acmgCodes: function(Assertions) {
            return Assertions.queryAcmgCodes();
          }
        },
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
  }

  // @ngInject
  function SearchViewController($scope, $state) {
    $scope.$watch(function() { return $state.current.name; }, function(state) {
      $scope.state = state;
    });
  }

})();
