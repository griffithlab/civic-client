(function() {
  'use strict';
  angular.module('civic.common')
    .directive('searchHighlighting', searchHighlighting)
    .controller('searchHighlightingCtrl', searchHighlightingCtrl);

    // @ngInject
    function searchHighlighting() {
      var directive = {
        restrict: 'A',
        templateUrl: 'components/directives/searchHighlighting.tpl.html',
        controller: 'searchHighlightingCtrl',
        scope: {
          content: '=highlightContent',
          query: '=searchHighlighting'
        }

      };

      return directive;
    }


    // @ngInject
    function searchHighlightingCtrl($scope){
    }

})();
