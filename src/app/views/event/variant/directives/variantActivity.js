(function() {
  angular.module('civic.event')
    .directive('variantActivity', variantActivity);

  function variantActivity() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/event/variant/directives/variantActivity.tpl.html',
      link: function($scope, $element, $attrs, GeneCtrl) {
        console.log('variantActivity linked.');
      }
    };

    return directive;
  }
})();