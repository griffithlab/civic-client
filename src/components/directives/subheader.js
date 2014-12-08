(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
    .controller('TypeAheadCtrl', TypeAheadCtrl)
    .controller('SubheaderCtrl', SubheaderCtrl);

  // @ngInject
  function subheader() {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'components/directives/subheader.tpl.html',
      controller: SubheaderCtrl
    };
    return directive;
  }

  // @ngInject
  function SubheaderCtrl($scope, $rootScope, $log, $timeout, $stateParams) {
    $log.info('SubheaderCtrl loaded');
    $scope.view = { };
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
      $scope.view.geneId = toParams.geneId;
      $scope.view.variantId = toParams.variantId;
      $scope.view.title = $scope.$eval(toState.data.titleExp);
    });
  }

  // @ngInject
  function TypeAheadCtrl($scope, $log, $location, $http, _) {
    $log.info('typeAheadCtrl loaded.');

    $scope.getVariants = function(val) {
      return $http.get('/api/variants?filter[entrez_gene]=' + val).then(function(data) {
        return _.map(data.data.result, function(event) {
          return {
            /*jshint camelcase: false */
            gene: event.entrez_gene,
            label: event.entrez_gene + '/' + event.variant,
            variant: event.variant
          };
        });
      });
    };

    $scope.onSelect = function($item) {

      // $log.info('onSelect called, location: ' + ['/gene/', $item.gene, '/variant/', $item.variant].join(' '));
      var loc = ['/events/genes/', $item.gene, '/variants/', $item.variant].join('');
      $log.info('location.path(' + loc + ')');
      $location.path(loc);
    };
  }
})();
