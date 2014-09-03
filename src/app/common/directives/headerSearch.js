angular.module('civic.common')
  .directive('headerSearch', headerSearch);

function headerSearch() {
  'use strict';

  function headerSearchCtrl() {

  }

  return {
    restrict: 'E',
    templateUrl: '/civic-client/common/directives/headerSearch.tpl.html',
    controller: headerSearch
  }

}