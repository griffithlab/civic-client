(function() {
  angular.module('civic.common')
    .filter('labelify', labelifyFilter)
    .filter('arrayToList', arrayToListFilter);

  // @ngInject
  function labelifyFilter() {
    return function (input) {
      input = input.replace(/_/g, " ");
      return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    }
  }

  // @ngInject
  function arrayToListFilter(_) {
    return function(input) {
      if (_.isArray(input)) {
        return input.join(', ');
      } else {
        return input;
      }
    }
  }
})();