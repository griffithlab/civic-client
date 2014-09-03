(function() {
  'use strict';
  angular.module('civic.browse')
    .controller('BrowseCtrl', BrowseCtrl)
    .config(browseConfig);

// @ngInject
  function BrowseCtrl($scope, $rootScope, $resource, $location, ngTableParams, $timeout, $log) {
    $log.info('BrowseCtrl loaded');
    $rootScope.navMode = 'sub';
    $rootScope.viewTitle = 'Browse';
    $rootScope.title = 'CIViC - Browse Events'
    $scope.loadedMsg = 'Loaded Browse!';

    var Api = $resource('/geneListMock');

    $scope.rowClick = function(gene) {
      $log.info('Clicked gene ' + ['/gene/', gene.entrez_gene, '/variant/', gene.variant].join(""));
      var loc = ['/gene/', gene.entrez_gene, '/variant/', gene.variant].join("");
      $log.info('location.path(' + loc + ')');
      $location.path(loc);
    };

    $scope.tableParams = new ngTableParams({
      page: 1,            // show first page
      count: 25,          // count per page
      sorting: {
        name: 'asc'     // initial sorting
      }
    }, {
      total: 0,           // length of data
      getData: function($defer, params) {
        // ajax request to api
        Api.get(params.url(), function(data) {
          $timeout(function() {
            // update table params
            params.total(data.total);
            // set new data
            $defer.resolve(data.result);
          }, 500);
        });
      }
    });
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
})();