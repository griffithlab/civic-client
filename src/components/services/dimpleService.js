(function() {
  'use strict';
  angular.module('civic.services')
    .factory('dimple', function ($window) {
      return $window.dimple;
    });
})();
