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
  function SubheaderCtrl($scope, $rootScope, $log, Genes) {
    $scope.view = { };
    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams) {
      $scope.view.params = toParams;
      if(_.has(toParams, 'geneId')) {
        Genes.get({ 'geneId': toParams.geneId }).$promise.then(function(gene) {
          $scope.view.gene = gene;
          $scope.view.title = $scope.$eval(toState.data.titleExp);
        });
      } else {
        $scope.view.title = $scope.$eval(toState.data.titleExp);
      }
    });
  }
})();
