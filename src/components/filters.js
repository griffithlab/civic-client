(function() {
  'use strict';
  angular.module('civic.common')
    .filter('labelify', labelifyFilter)
    .filter('arrayToList', arrayToListFilter)
    .filter('encodeUri', encodeUri)
    .filter('decodeUri', decodeUri);

  // @ngInject
  function labelifyFilter() {
    return function (input) {
      input = input.replace(/_/g, ' ');
      return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };
  }

  // @ngInject
  function arrayToListFilter(_) {
    return function(input, limitTo, terminator, showTotal) {
      limitTo = parseInt(limitTo, 10);
      terminator = terminator ? terminator : '';
      if (_.isArray(input) && parseInt(limitTo, 10)) {
        var output = input.slice(0,limitTo).join(', ').concat(terminator);
        if(showTotal && input.length > limitTo) {
          output = output + '<span class="more"> (' + String(input.length - limitTo) + ' more)</span>';
        }
        return output;
      } else if (_.isArray(input)) {
        return input.join(', ');
      } else {
        return input;
      }
    };
  }

  // @ngInject
  function encodeUri($window) {
    return function (input) {
      return $window.encodeURIComponent(input);
    };
  }

// @ngInject
  function decodeUri($window) {
    return function (input) {
      return $window.decodeURIComponent(input);
    };
  }
})();
