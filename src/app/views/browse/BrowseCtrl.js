angular.module('civic.browse')
  .controller('BrowseCtrl', BrowseCtrl)
  .config(browseConfig);

// @ngInject
function BrowseCtrl($scope, $rootScope, $resource, ngTableParams, $timeout, $log) {
  'use strict';
  $log.info('BrowseCtrl loaded');
  $rootScope.navMode = 'sub';
  $rootScope.viewTitle = 'Browse';
  $scope.loadedMsg = 'Loaded Browse!';

  var Api = $resource('/geneDataMock');

  $scope.tableParams = new ngTableParams({
    page: 1,            // show first page
    count: 10,          // count per page
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
  'use strict';
  $stateProvider
    .state('browse', {
      url: '/browse',
      controller: 'BrowseCtrl',
      templateUrl: '/civic-client/views/browse/browse.tpl.html'
    });
}