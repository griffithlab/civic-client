angular.module('civic.event')
  .controller('GeneCtrl', GeneCtrl)
  .config(geneConfig);

// @ngInject
function GeneCtrl($scope, $rootScope, $stateParams, $resource, $log, $http) {
  'use strict';
  $log.info('GeneCtrl loaded.');
  var geneId = $stateParams.geneId;

  $log.info('setting title to View Gene.');
  $rootScope.viewTitle = 'View Gene';
  $rootScope.title = 'CIViC - View ' + geneId;
  $rootScope.navMode = 'sub';
  $scope.gene = {};


  var Api = $resource('/geneDataMock');
  Api.get({ 'id': geneId }, function(data) {
    $scope.gene = data.result;
    // TODO: replace with better logic in template, this is kludgy
    $scope.variantGroupsExist = typeof($scope.gene.variantGroups) === 'object';
  });
}

// @ngInject
function geneConfig($stateProvider) {
  'use strict';
  console.log('geneConfig called');
  $stateProvider
    .state('gene', {
      url: '/gene/:geneId',
      controller: 'GeneCtrl',
      templateUrl: '/civic-client/views/event/gene/gene.tpl.html'
    });
}