(function() {
  angular.module('civic.services')
  .directive('uiView', function ($animate, $interpolate) {
    function getViewName(scope, element, attrs) {
      var name = $interpolate(attrs.uiView || attrs.name || '')(scope);
      var inherited = element.parent().inheritedData('$uiView');
      return name.indexOf('@') >= 0 ? name : (name + '@' + (inherited ? inherited.state.name : ''));
    }

    return {
      priority: 0,
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.$on('$stateChangeStart', function (e) {
          var name = getViewName(scope, element, attrs);
          if (e.viewsToFlush[name]) {
            $animate.addClass(element, 'ui-resolving');
          }
        });

        scope.$on('$stateChangeSuccess', function () {
          $animate.removeClass(element, 'ui-resolving');
        });

        scope.$on('$stateChangeError', function () {
          $animate.removeClass(element, 'ui-resolving');
        });
      }

    };
  });
})();
