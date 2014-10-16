(function() {
  'use strict';
  angular.module('civic.services')
    .factory('_', function ($window) {
      return $window._;
    });
})();