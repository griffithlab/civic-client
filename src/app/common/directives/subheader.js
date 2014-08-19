angular.module('civic.common')
  .directive('subheader', subheader);

/**
 * @name subheaderCtrl
 * @param $scope
 * @param $log
 * @ngInject
 */
function subheader($rootScope, $log) {
  'use strict';

  // @ngInject
  function subheaderCtrl($scope, $element, $attrs) {
    $log.info('subheaderCtrl loaded');
    // $scope.viewTitle = $rootScope.viewTitle;
    $scope.$watch(function() { return $rootScope.viewTitle; },
      function() {
        $scope.viewTitle = $rootScope.viewTitle;
      })
  }

  var directive = {
    restrict: 'E',
    scope: true,
    templateUrl: 'common/directives/subheader.tpl.html',
    controller: subheaderCtrl
  };

  return directive;
}