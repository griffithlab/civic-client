(function() {
  angular.module('civic.event')
    .directive('geneTalk', geneTalk);

  function geneTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/event/gene/directives/geneTalk.tpl.html',
      link: function($scope, $element, $attrs, GeneCtrl) {
        console.log('geneTalk linked.');
      }
    };

    return directive;
  }
})();