(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
    .controller('typeAheadCtrl', typeAheadCtrl);

  /**
   * @name subheaderCtrl
   * @param $scope
   * @param $log
   * @ngInject
   */
  function subheader($rootScope, $log) {

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

  function typeAheadCtrl($scope, $log, $location) {
    $log.info('typeAheadCtrl loaded.');
//    var gd = GeneData;
//    $scope.geneList = [];
//    gd.getGenesAndVariants().then(function(data) {
//      $scope.geneList = data;
//    });
//
//    $scope.onSelect = function($item) {
//      // $log.info('onSelect called, location: ' + ['/gene/', $item.gene, '/variant/', $item.variant].join(' '));
//      var loc = ['/gene/', $item.gene, '/variant/', $item.variant].join("");
//      $log.info('location.path(' + loc + ')');
//      $location.path(loc);
//    };
  }
})();