(function() {
  'use strict';
  angular.module('civic.common')
    .filter('labelify', labelifyFilter)
    .filter('arrayToList', arrayToListFilter)
    .filter('encodeUri', encodeUri)
    .filter('capitalize', capitalizeFilter)
    .filter('decodeUri', decodeUri)
    .filter('ifEmpty', ifEmpty)
    .filter('unsafe', unsafe);

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

  // @ngInject
  function capitalizeFilter(_) {
    return function (input) {
      if (!_.isNull(input) && !_.isUndefined(input)) {
        input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
      } else {
        return;
      }

    };
  }

  // @ngInject
  function ifEmpty() {
    return function(input, defaultValue) {
      if (angular.isUndefined(input) || input === null || input === '') {
        return defaultValue;
      }

      return input;
    };
  }

  // @ngInject
  function unsafe($sce) { return $sce.trustAsHtml; }

})();
