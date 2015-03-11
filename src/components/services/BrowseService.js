(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Browse', BrowseService);

  // @ngInject
  function BrowseService($resource) {
    var Browse = $resource('/api/datatables/:perspective',
      {},
      {
        getVariants: {
          method: 'GET',
          isArray: false,
          transformResponse: function(data) {
            var events = JSON.parse(data);
            events.result = _.map(events.result, function (event) {
              event.diseases = event.diseases.join(', ');
              return event;
            });
            return events;
          }
        },
        query: {
          method: 'GET',
          isArray: true
        },
        getGenes: {
          method: 'GET',
          isArray: false,
          transformResponse: function(data) {
            var events = JSON.parse(data);
            // gene grid requires some munging
            events.result = _.map(_.groupBy(events.result, 'entrez_gene'), function(variants, gene) {
              return {
                entrez_id: variants[0].entrez_id,
                aliases: variants[0].aliases.join(', '),
                entrez_gene: gene,
                variant_count: variants.length,
                diseases: _.chain(variants)// combine disease, drop dups, stringify
                  .pluck('diseases')
                  .tap(function(array) {
                    return array.toString()
                  })
                  .words(/[^,]+/g)
                  .map(function(disease) { return _.trim(disease)})
                  .uniq()
                  .value()
                  .join(', '),
                evidence_item_count: _.reduce(variants, function(total, current) {
                  return total + current.evidence_item_count;
                }, 0)
              }
            });
            events.total = events.result.length;
            return events;
          }
        }
      });

    return Browse;
  }

})();
