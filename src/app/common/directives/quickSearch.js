(function() {
  'use strict';
  angular.module('civic.common')
    .directive('quickSearch', quickSearch)
    .controller('quickSearchCtrl', quickSearchCtrl);

  // @ngInject
  function quickSearchCtrl($scope, $log, $location, $resource, $http, $state) {
    $log.info('quickSearchCtrl loaded.');

    $scope.getVariants = function (val) {
      return $http.get('/api/variants?filter[entrez_gene]=' + val).then(function (data) {
        return _.map(data.data.result, function (event) {
          return {
            gene: event.entrez_gene,
            variant: event.variant,
            label: event.entrez_gene + '/' + event.variant
          }
        })
      });
    };

    $scope.onSelect = function($item, $model, $label) {
      $state.go('events.genes.summary.variants.summary', {geneId: $item.gene, variantId: $item.variant});
    };

  }
  // @ngInject
  function quickSearch($log) {
    var directive = {
      templateUrl: '/civic-client/common/directives/quickSearch.tpl.html',
      restrict: 'E',
      scope: true,
      controller: quickSearchCtrl
    };

    return directive;
  }
})();