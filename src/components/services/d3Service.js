(function() {
  'use strict';
  angular.module('civic.services')
    .factory('d3', function ($window) {
      return $window.d3;
    });
})();
