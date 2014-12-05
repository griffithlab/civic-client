(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
    .controller('TypeAheadCtrl', TypeAheadCtrl);

  // @ngInject
  function subheader() {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'components/directives/subheader.tpl.html',
      controller: subheaderCtrl
    };
    return directive;
  }

  // @ngInject
  function subheaderCtrl($scope, $rootScope, $element, $attrs, $log) {
    $log.info('subheaderCtrl loaded');
    // $scope.viewTitle = $rootScope.viewTitle;
    $scope.$watch(function() { return $rootScope.viewTitle; },
      function() {
        $scope.viewTitle = $rootScope.viewTitle;
      })
  }

  // @ngInject
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
      var loc = ['/events/genes/', $item.gene, '/variants/', $item.variant].join("");
      $log.info('location.path(' + loc + ')');
      $location.path(loc);
    };
  }
})();
