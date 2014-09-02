angular.module('civic.event')
  .controller('EventCtrl', EventCtrl)
  .config(eventConfig);

// @ngInject
function EventCtrl($rootScope, $scope, $stateParams, $resource, $log) {
  'use strict';
  var geneId = $stateParams.geneId;
  var eventId = $stateParams.eventId;

  $log.info('setting title to View Event.');
  $rootScope.viewTitle = 'View Event';
  $rootScope.title = 'CIViC - View ' + geneId + '-' + eventId;
  $rootScope.navMode = 'sub';
  $scope.event = {};

  var Api = $resource('/eventDataMock');
  Api.get({ 'id': eventId }, function(data) {
    $scope.event.summary = data.summary;
    $scope.event.name = data.variant;
    $scope.event.details = data.details;
    $scope.event.evidence = data.evidence;
  });
}

// @ngInject
function eventConfig($stateProvider) {
  'use strict';
  $stateProvider
    .state('gene.event', {
      url: '/event/:eventId',
      controller: 'EventCtrl',
      templateUrl: '/civic-client/views/event/event.tpl.html'
    });
}