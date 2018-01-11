(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
    .controller('SubheaderCtrl', SubheaderCtrl);

  // @ngInject
  function subheader(Security) {
    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: 'components/directives/subheader.tpl.html',
      controller: SubheaderCtrl,
      link: /* @ngInject */ function($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isEditor = Security.isEditor;
        $scope.isAdmin = Security.isAdmin;
      }
    };
    return directive;
  }

  // @ngInject
  function SubheaderCtrl($scope, $rootScope, _, Security) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isEditor = Security.isAuthenticated;

    $scope.$rootScope = $rootScope;

    $scope.addEvidenceUrlBase = $scope.addEvidenceUrl = 'add/evidence/basic';
    $scope.addAssertionUrlBase = $scope.addAssertionUrl = 'add/assertion';

    $scope.$watchCollection('$rootScope.stateParams', function(stateParams){
      if(_.has(stateParams, 'geneId')) {
        $scope.addEvidenceUrl = $scope.addEvidenceUrlBase + '?geneId=' + stateParams.geneId;
        $scope.addAssertionUrl = $scope.addAssertionUrlBase + '?geneId=' + stateParams.geneId;

        if(_.has(stateParams, 'variantId')) {
          $scope.addEvidenceUrl = $scope.addEvidenceUrl + '&variantId=' + stateParams.variantId;
          $scope.addAssertionUrl = $scope.addAssertionUrl + '&variantId=' + stateParams.variantId;
        }
      }
    });

    $rootScope.$on('title:update', function(event, data) {
      $scope.view.stateTitle = data.newTitle;
    });
  }
})();
