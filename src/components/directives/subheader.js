(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
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
  function SubheaderCtrl($scope, $rootScope, TitleService) {
    $rootScope.$on('title:update', function(event, data) {
      $scope.view.stateTitle = data.newTitle;
    })
  }
})();
