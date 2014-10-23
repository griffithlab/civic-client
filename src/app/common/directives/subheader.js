(function () {
  'use strict';
  angular.module('civic.common')
    .directive('subheader', subheader)
    .controller('TypeAheadCtrl', TypeAheadCtrl);

  /**
   * @name subheaderCtrl
   * @param $scope
   * @param $log
   * @ngInject
   */
  function subheader($rootScope, $log) {

    // @ngInject
    function subheaderCtrl($scope, $element, $attrs) {
      $log.info('subheaderCtrl loaded');
      // $scope.viewTitle = $rootScope.viewTitle;
      $scope.$watch(function() { return $rootScope.viewTitle; },
        function() {
          $scope.viewTitle = $rootScope.viewTitle;
        })
    }

    var directive = {
      restrict: 'E',
      scope: true,
      templateUrl: '/civic-client/common/directives/subheader.tpl.html',
      controller: subheaderCtrl
    };

    return directive;
  }

  function TypeAheadCtrl($scope, $log, $location, $resource, $http) {
    $log.info('typeAheadCtrl loaded.');

    // Any function returning a promise object can be used to load values asynchronously
//    $scope.getLocation = function(val) {
//      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
//        params: {
//          address: val,
//          sensor: false
//        }
//      }).then(function(response){
//        return response.data.results.map(function(item){
//          return item.formatted_address;
//        });
//      });
//    };

    $scope.getVariants = function(val) {
      var Api = $resource('/api/variants');
      var params = {
        page: "1",
        count: "25",
        'filter[entrez_gene]': val,
        'sorting[entrez_gene]': "asc"
      };
      return $http.get('/api/variants', params).then(function(data) {
        return _.pluck(data.data.result, 'entrez_gene')
      });
    };

    $scope.onSelect = function($item) {
      // $log.info('onSelect called, location: ' + ['/gene/', $item.gene, '/variant/', $item.variant].join(' '));
      var loc = ['/gene/', $item.gene, '/variant/', $item.variant].join("");
      $log.info('location.path(' + loc + ')');
      $location.path(loc);
    };
  }
})();