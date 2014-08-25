angular.module('civic.event')
  .controller('GeneCtrl', GeneCtrl)
  .config(geneConfig);

// @ngInject
function GeneCtrl($scope, $rootScope, $resource, $log, $http) {
  'use strict';
  $log.info('GeneCtrl loaded.');
  $rootScope.viewTitle = 'Gene IDH1';
  $rootScope.navMode = 'sub';
  $scope.gene = {};

  // couldn't get this to work properly, directly assigning data for UX design work
  var Api = $resource('/geneDataMock');
  Api.get({ 'id': 1234 }, function(data) {
    $scope.gene = data.result;
  });

//  $scope.gene = {
//    name: "IDH1",
//    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eleifend nec nulla sit amet euismod. Aliquam faucibus tellus neque. Quisque sed dui quis nulla efficitur fermentum sit amet sit amet eros. Pellentesque porttitor dolor lectus, in ullamcorper ante fringilla placerat. Praesent porttitor vestibulum lectus, eget lacinia nibh rhoncus ut. Nulla vel mi sagittis, eleifend tellus ut, placerat eros. Nullam pharetra, ipsum vitae tempus mollis, purus leo consectetur quam, sit amet hendrerit libero sem nec quam. Nulla viverra enim non bibendum mollis.",
//    metrics: {
//      "metric1": 123,
//      "metric2": 'lorem ipsum, dolor sit amet',
//      "metric3": 'summary of something'
//    },
//    events: ["VARIANT1", "VARIANT2", "VARIANT3", "VARIANT4", "VARIANT5"],
//    eventGroups: {
//      "groupName": ["VARIANT6", "VARIANT7"]
//    }
//  };

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