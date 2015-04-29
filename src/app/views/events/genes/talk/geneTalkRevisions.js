(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneTalkRevisionsController', GeneTalkRevisionsController)
    .directive('geneTalkRevisions', geneTalkRevisionsDirective);

  // @ngInject
  function geneTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: '^^entityTalkView',
      link: geneTalkRevisionsLink,
      controller: 'GeneTalkRevisionsController',
      templateUrl: 'app/views/events/genes/talk/geneTalkRevisions.tpl.html'
    }
  }

  // @ngInject
  function geneTalkRevisionsLink(scope, element, attrs, geneTalkView) {
    var geneModel,
      ctrl;
    ctrl = scope.ctrl = {};
    scope.geneTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function GeneTalkRevisionsController($scope) {
    //var ctrl = $scope.ctrl = {};
    //$scope.$watch('geneTalkModel', function(geneTalkModel) {
    //  console.log('*** geneTalkRevisions watcher triggered. ***');
    //  ctrl.geneTalkModel = geneTalkModel;
    //}, true);
  }

})();
