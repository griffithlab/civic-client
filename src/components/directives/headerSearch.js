(function() {
  'use strict';
  angular.module('civic.common')
    .directive('headerSearch', headerSearch);

  function headerSearch() {
    return {
      restrict: 'E',
      templateUrl: 'components/directives/headerSearch.tpl.html',
      controller: headerSearch
    };

  }
})();
