angular.module('civic.common')
  .directive('headerSearch', headerSearch);

function headerSearch() {
  'use strict';

  function headerSearchCtrl() {

  }

  return {
    restrict: 'E',
    templateUrl: 'components/directives/headerSearch.tpl.html',
    controller: headerSearch
  }

}
