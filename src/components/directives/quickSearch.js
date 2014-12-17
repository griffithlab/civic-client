(function() {
  'use strict';
  angular.module('civic.common')
    .directive('quickSearch', quickSearch)
    .controller('quickSearchCtrl', quickSearchCtrl);

  // @ngInject
  function quickSearchCtrl($scope, $log, $http, $state, _) {
    $log.info('quickSearchCtrl loaded.');

    $scope.getVariants = function (val) {
      return $http.get('/api/variants?filter[entrez_gene]=' + val).then(function (data) {
        return _.map(data.data.result, function (event) {
          return {
            /*jshint camelcase: false */
            gene: event.entrez_id,
            label: event.entrez_gene + ' / ' + event.variant,
            variant: event.variant,
            variant_id: event.variant_id
          };
        });
      });
    };

    $scope.onSelect = function($item) {
      $state.go('events.genes.summary.variants.summary', {geneId: $item.gene, variantId: $item.variant_id});
    };

  }
  // @ngInject
  function quickSearch() {
    var directive = {
      templateUrl: 'components/directives/quickSearch.tpl.html',
      restrict: 'E',
      scope: true,
      controller: quickSearchCtrl
    };

    return directive;
  }
})();
