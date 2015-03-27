require('chai').use(require('chai-as-promised')).use(require('sinon-chai'));

global.sinon = require('sinon');
global.expect = require('chai').expect;
global.sinonAsPromised = require('sinon-as-promised');

// init sinon-as-promised with $q v1.2 shim
//angular.injector(['ng']).invoke(function($q) {
//  function $qShim (resolver) {
//    var deferred = $q.defer();
//    var resolve = angular.bind(deferred, deferred.resolve);
//    var reject = angular.bind(deferred, deferred.reject);
//    var promise = deferred.promise;
//
//    resolver(resolve, reject);
//
//    return promise;
//  }
//  sinonAsPromised($qShim);
//});
