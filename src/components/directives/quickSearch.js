(function() {
  'use strict';
  angular.module('civic.common')
    .directive('quickSearch', quickSearch)
    .controller('quickSearchCtrl', quickSearchCtrl);

  // @ngInject
  function quickSearchCtrl($scope, TypeAheadResults, $state, _) {
    $scope.getVariants = function (val) {
      return TypeAheadResults.query({ query: val }).$promise
        .then(function (response) {
          var labelLimit = 75;
          return _.map(response.result, function (event) {
            var label = event.entrez_gene + ' / ' + event.variant;

            if (_.includes(event.terms, 'gene_aliases')) {
              var aliasLabel = event.gene_aliases.length > 1 ? 'Aliases' : 'Alias';
              label = label + ' -- ' + aliasLabel + ': ' + event.gene_aliases.join(', ');
            }

            if (_.includes(event.terms, 'drug_names')) {
              var drugLabel = event.drug_names.length > 1 ? 'Drugs' : 'Drug';
              label = label + ' -- ' + drugLabel + ': ' + event.drug_names.join(', ');
            }

            if (_.includes(event.terms, 'disease_names')) {
              var diseaseLabel = event.disease_names.length > 1 ? 'Diseases' : 'Disease';
              label = label + ' -- ' + diseaseLabel + ': ' + event.disease_names.join(', ');
            }

            if (label.length > labelLimit) { label = _.trunc(label, labelLimit); }

            return {
              /*jshint camelcase: false */
              gene: event.entrez_name,
              geneId: event.gene_id,
              label: label,
              variant: event.variant,
              variantId: event.variant_id
            };
          });
        });
    };

    $scope.onSelect = function($item, $model) {
      $state.go('events.genes.summary.variants.summary', {geneId: $item.geneId, variantId: $item.variantId});
      $scope.asyncSelected.model = ''; // clear typeahead
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
