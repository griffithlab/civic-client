(function() {
  angular.module('civic.event')
    .directive('geneActivity', geneActivity);

  function geneActivity() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/event/gene/directives/geneActivity.tpl.html',
      link: function($scope, $element, $attrs, GeneCtrl) {
        console.log('geneActivity linked.');
      }
    };

    return directive;
  }
})();