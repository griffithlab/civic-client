angular.module('eventDataMock', ['ngTable', 'ngMockE2E'])
  .run(function($httpBackend, $filter, $log, ngTableParams) {
    'use strict';
    $log.info('DemoMock loaded.');
    // emulation of api server
    $httpBackend.whenGET(/eventDataMock.*/).respond(function(method, url) {
      var query = url.split('?')[1],
        requestParams = {};

      $log.log('Ajax request: ', url);

      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        requestParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }

      var params;
      // parse url params
      for (var key in requestParams) {
        if (key.indexOf('[') >= 0) {
          var lastKey = '';
          var  value = requestParams[key];

          params = key.split(/\[(.*)\]/);
          angular.forEach(params.reverse(), function(name) {
            if (name !== '') {
              var v = value;
              value = {};
              value[lastKey = name] = _.isNumber(v) ? parseFloat(v) : v;
            }
          });
          requestParams[lastKey] = angular.extend(requestParams[lastKey] || {}, value[lastKey]);
        } else {
          requestParams[key] = _.isNumber(requestParams[key]) ? parseFloat(requestParams[key]) : requestParams[key];
        }
      }

      /* jshint ignore:start */
      var data;
      /* jshint ignore:end */

      params = new ngTableParams(requestParams);
      data = params.filter() ? $filter('filter')(data, params.filter()) : data;
      data = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

      var total = data.length;
      data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());

      return [200, {
        result: data,
        total: total
      }];
    });
    $httpBackend.whenGET(/.*/).passThrough();
  });