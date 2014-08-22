angular.module('geneDataMock', ['ngMockE2E'])
  .run(function($httpBackend, $filter, $log) {
    'use strict';
    $log.info('DemoMock loaded.');
    // emulation of api server
    $httpBackend.whenGET(/geneDataMock.*/).respond(function(method, url) {
      $log.log('Ajax request: ', url);

      var data = {

      };

      return [200, data];
    });
    $httpBackend.whenGET(/.*/).passThrough();
  });