(function() {
  'use strict';
  angular.module('civic.event')
    .controller('VariantGroupCtrl', VariantGroupCtrl)
    .config(variantGroupConfig);

// @ngInject
  function VariantGroupCtrl ($rootScope, $scope, $stateParams, $resource, $log) {
    $log.info('VariantGroupCtrl instantiated.');
    var geneId = $stateParams.geneId;
    var variantGroupId = $stateParams.variantGroupId;

    $log.info('setting title to View Variant Group.');
    $rootScope.viewTitle = 'View Variant Group';
    $rootScope.title = 'CIViC - View ' + geneId + '-' + variantGroupId;
    $rootScope.navMode = 'sub';
    $scope.variantGroup = {};

    var Api = $resource('/variantGroupDataMock');
    Api.get({ 'id': variantGroupId }, function(data) {
      $scope.variantGroup= data.result;
    });
  }

  // @ngInject
  function variantGroupConfig($stateProvider) {
    console.log('variantGroupConfig called.');
    $stateProvider
      .state('gene.variant-group', {
        url: '/variant-group/:variantGroupId',
        controller: 'VariantGroupCtrl',
        templateUrl: '/civic-client/views/event/variant-group/variantGroup.tpl.html'
      });
  }
})();