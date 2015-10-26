(function() {
  'use strict';
  angular.module('civic.browse')
    .config(BrowseViewConfig);

  // @ngInject
  function BrowseViewConfig($stateProvider) {
    $stateProvider
      .state('browse', {
        abstract: true,
        url: '/browse',
        templateUrl: 'app/views/browse/browse.tpl.html'
      })
      .state('browse.variants', {
        url: '/variants?page',
        reloadOnSearch: false,
        controller: 'BrowseController',
        templateUrl: 'app/views/browse/browseViews.tpl.html',
        data: {
          titleExp: '"Browse Variants"',
          navMode: 'sub'
        },
        resolve: {
          mode: function() {
            return 'variants';
          },
          page: /* @ngInject */ function($stateParams, _) {
            if(!_.isUndefined($stateParams.page)) { return $stateParams.page; }
            else { return 1; }
          }
        }
      })
      .state('browse.genes', {
        url: '/genes?page',
        reloadOnSearch: false,
        controller: 'BrowseController',
        templateUrl: 'app/views/browse/browseViews.tpl.html',
        data: {
          titleExp: '"Browse Genes"',
          navMode: 'sub'
        },
        resolve: {
          mode: function() {
            return 'genes';
          },
          page: /* @ngInject */ function($stateParams, _) {
            if(!_.isUndefined($stateParams.page)) { return $stateParams.page; }
            else { return 1; }
          }
        }
      });
  }

})();
