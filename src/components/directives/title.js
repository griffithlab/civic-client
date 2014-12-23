(function() {
  'use strict';
  angular.module('civic.common')
    .directive('title', titleDirective);

  // @ngInject
  function titleDirective($rootScope, $timeout, TitleService) {
    var directive = {
      restrict: 'E',
      //templateUrl: '<title>{{ view.stateTitle }}</title>',
      link: function() {
        var listener = function(event, data) {
          console.log('title title:update listener called. ****************');
          $timeout(function() {
            $rootScope.title = data.length > 0
              ? data
              : 'CIViC - Clinincal Interpretation of Variants in Cancer';
          });
        };
        $rootScope.$on('title:update', listener);
      }
    };

    return directive;
  }
})();
