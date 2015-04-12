(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('MyGeneInfoController', MyGeneInfoController)
    .directive('myGeneInfo', function() {
      return {
        restrict: 'E',
        scope: {
          geneInfo: '='
        },
        controller: 'MyGeneInfoController',
        templateUrl: 'app/views/events/genes/myGeneInfo.tpl.html'
      }
    });

  // @ngInject
  function MyGeneInfoController($scope) {

  }
})();
