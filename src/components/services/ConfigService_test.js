/* jshint strict:false, globalstrict:false */
/* global describe, it, beforeEach, inject, module, expect */
describe('ConfigService', function () {

  var configService,
    scope;

  beforeEach(module('civicClient'));

  beforeEach(inject(function ($injector) {
    scope = $injector.get('$rootScope');
    configService = $injector.get('ConfigService', {'$scope': scope});
  }));

  it('should provide the CIViC server URL', function () {
    expect(configService.serverUrl).to.equal('http://127.0.0.1:3000/');
  });
});
