angular.module('civic.event')
  .controller('GeneCtrl', GeneCtrl)
  .config(geneConfig);

// @ngInject
function GeneCtrl($scope, $rootScope) {
  'use strict';
  $rootScope.viewTitle = 'View Gene';
  $rootScope.navMode = 'sub';

}

// @ngInject
function geneConfig($stateProvider) {
  'use strict';
  console.log('geneConfig called');
  $stateProvider
    .state('gene', {
      url: '/gene/:geneId',
      controller: 'GeneCtrl',
      templateUrl: '/civic-client/views/event/gene.tpl.html'
    });
}