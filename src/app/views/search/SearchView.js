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
        resolve: {
          acmgCodes: function(Assertions) {
            return Assertions.queryAcmgCodes();
          },
          organizations: function(Organizations) {
            return Organizations.query().then(function(response) {
              return response.result;
            });
          }
        },
        controller: 'SearchViewController',
        templateUrl: 'app/views/search/search.tpl.html',
      })
      .state('search.evidence', {
        url: '/evidence/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/templates/searchEvidence.tpl.html',
        data: {
          titleExp: '"Search Evidence"',
          navMode: 'sub'
        }
      })
      .state('search.assertions', {
        url: '/assertions/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/templates/searchAssertions.tpl.html',
        data: {
          titleExp: '"Search Assertions"',
          navMode: 'sub'
        }
      })
      .state('search.genes', {
        url: '/genes/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/templates/searchGenes.tpl.html',
        data: {
          titleExp: '"Search Genes"',
          navMode: 'sub'
        }
      })
      .state('search.suggested_changes', {
        url: '/suggested_changes/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/templates/searchSuggestedChanges.tpl.html',
        data: {
          titleExp: '"Search Suggested Changes"',
          navMode: 'sub'
        }
      })
      .state('search.variants', {
        url: '/variants/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/templates/searchVariants.tpl.html',
        data: {
          titleExp: '"Search Variants"',
          navMode: 'sub'
        }
      })
      .state('search.sources', {
        url: '/sources/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/templates/searchSources.tpl.html',
        data: {
          titleExp: '"Search Sources"',
          navMode: 'sub'
        }
      })
      .state('search.variantGroups', {
        url: '/variantGroups/:token',
        reloadOnSearch: false,
        controller: 'SearchController',
        templateUrl: 'app/views/search/templates/searchVariantGroups.tpl.html',
        data: {
          titleExp: '"Search Variant Groups"',
          navMode: 'sub'
        }
      });

    // redirect root /search requests to /search/evidence
    $urlRouterProvider.when('/search', '/search/evidence/:token');

  }

  // @ngInject
  function SearchViewController($scope,
                                $state,
                                acmgCodes,
                                organizations,
                                ConfigService,
                                EvidenceItemFieldConfig,
                                VariantFieldConfig,
                                AssertionFieldConfig,
                                GeneFieldConfig,
                                SourceFieldConfig,
                                VariantGroupFieldConfig,
                                SuggestedChangeFieldConfig) {
    // define fields here, then access from SearchController with $scope.$parent.fields
    $scope.fields = {};
    $scope.fields.evidence_items = EvidenceItemFieldConfig.getFields(organizations);
    $scope.fields.genes = GeneFieldConfig;
    $scope.fields.variants = VariantFieldConfig;
    $scope.fields.variantGroups = VariantGroupFieldConfig;
    $scope.fields.sources = SourceFieldConfig;
    $scope.fields.suggested_changes = SuggestedChangeFieldConfig;

    $scope.fields.assertions = AssertionFieldConfig.getFields(acmgCodes, organizations);

    $scope.$watch(function() { return $state.current.name; }, function(state) {
      $scope.state = state;
    });

  }

})();
