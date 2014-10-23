(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
    .controller('TypeAheadCtrl', TypeAheadCtrl);

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
      templateUrl: '/civic-client/common/directives/subheader.tpl.html',
      controller: subheaderCtrl
    };

    return directive;
  }

  function TypeAheadCtrl($scope, $log, $location, $resource, $http) {
    $log.info('typeAheadCtrl loaded.');

    $scope.getVariants = function(val) {
      return $http.get('/api/variants?filter[entrez_gene]=' + val).then(function(data) {
        return _.map(data.data.result, function(event) {
          return {
            gene: event.entrez_gene,
            variant: event.variant,
            label: event.entrez_gene + '/' + event.variant
          }
        })
      });
    };

    $scope.onSelect = function($item, $model, $label) {
      // $log.info('onSelect called, location: ' + ['/gene/', $item.gene, '/variant/', $item.variant].join(' '));
      var loc = ['/gene/', $item.gene, '/variant/', $item.variant].join("");
      $log.info('location.path(' + loc + ')');
      $location.path(loc);
    };
  }
})();