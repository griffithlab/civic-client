(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseCtrl', BrowseCtrl)
    .config(browseConfig)
    .filter('ceil', ceilFilter);

// @ngInject
  function BrowseCtrl($scope, $rootScope, $resource, $location, ngTableParams, $timeout, _, $log) {
    $log.info('BrowseCtrl loaded');
    $rootScope.navMode = 'sub';
    $rootScope.viewTitle = 'Browse Events';
    $rootScope.title = 'CIViC - Browse Events'
    $scope.loadedMsg = 'Loaded Browse!';

//    var Api = $resource('/geneListMock');
    var Api = $resource('/api/variants');

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 25,          // count per page
      sorting: {
        entrez_gene: 'asc'     // initial sorting
      }
    }, {
      total: 0,           // length of data
      debugMode: true,
      getData: function($defer, params) {
        // ajax request to api
        Api.get(params.url(), function(data) {
          $timeout(function() {
            // update table params
            params.total(data.total);

            // format categories & protein function
            _.each(data.result, function(event) {
              event.gene_category = event.gene_category.join();
              event.protein_function = event.protein_function.join();
            });

            // set new data
            $defer.resolve(data.result);
          });
        });
      }
    });

    $scope.rowClick = function(gene) {
      $log.info('Clicked gene ' + ['/gene/', gene.entrez_gene, '/variant/', gene.variant].join(""));
      var loc = ['/gene/', gene.entrez_gene, '/variant/', gene.variant].join("");
      $log.info('location.path(' + loc + ')');
      $location.path(loc);
    };
  }

// @ngInject
  function browseConfig($stateProvider) {
    $stateProvider
      .state('browse', {
        url: '/browse',
        controller: 'BrowseCtrl',
        templateUrl: '/civic-client/views/browse/browse.tpl.html'
      });
  }

  function ceilFilter() {
    return function(num) {
      return Math.ceil(num);
    }
  }

})();