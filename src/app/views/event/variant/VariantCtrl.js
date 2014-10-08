angular.module('civic.event')
  .controller('VariantCtrl', VariantCtrl)
  .config(variantConfig);

// @ngInject
function VariantCtrl($rootScope, $scope, $stateParams, $resource, $log) {
  'use strict';
  var geneId = $stateParams.geneId;
  var variantId = $stateParams.variantId;

  $log.info('setting title to View Variant.');
  $rootScope.viewTitle = 'View Variant';
  $rootScope.title = 'CIViC - View ' + geneId + '-' + variantId;
  $rootScope.navMode = 'sub';
  $scope.variant = {};

  $scope.tabState = {};
  $scope.tabState.name = 'summary';

  var Api = $resource('/variantDataMock');
  Api.get({ 'id': variantId }, function(data) {
    $scope.variant.summary = data.summary;
    $scope.variant.name = data.variant;
    $scope.variant.details = data.details;
    $scope.variant.evidence = data.evidence;
  });
}

// @ngInject
function variantConfig($stateProvider) {
  'use strict';
  $stateProvider
    .state('gene.variant', {
      url: '/variant/:variantId',
      controller: 'VariantCtrl',
      templateUrl: '/civic-client/views/event/variant/variant.tpl.html'
    });
}