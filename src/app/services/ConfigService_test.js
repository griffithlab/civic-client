/* jshint strict:false, globalstrict:false */
/* global describe, it, beforeEach, inject, module */
describe('ConfigService', function () {
  var confService,
    scope;

  beforeEach(module('civicClient'));

  beforeEach(inject(function ($injector) {
    scope = $injector.get('$rootScope');

    confService = function () {
      return $injector.get('$controller')('ConfigService', {'$scope': scope});
    };
  }));

  it('should provide the CIViC server URL', function () {
    confService();
    confService.serverUrl.should.equal('http://localhost:3000');
  });
});