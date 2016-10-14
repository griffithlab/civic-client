(function() {
  'use strict';
  angular.module('civic.sources')
    .controller('SourcesSummaryController', SourcesSummaryController);

  // @ngInject
  function SourcesSummaryController($scope, source, Sources, Security, Search) {
    console.log('SourcesSummaryController called.');
    var vm = $scope.vm = {};

    vm.isEditor = Security.isEditor();

    function parseSource (source) {
      source.author_list_string = _(source.author_list)
        .sortBy('position')
        .map(function(author) {
          return [author.fore_name, author.last_name].join(' ');
        })
        .value()
        .join(', ');

      // format publication date
      var pubDate = [source.publication_date.year];
      if(!_.isUndefined(source.publication_date.month))
        pubDate.push(source.publication_date.month);

      if(!_.isUndefined(source.publication_date.day))
        pubDate.push(source.publication_date.day);

      source.publication_date_string = pubDate.join('-');
      return source;
    }

    vm.source = parseSource(source);

    // fetch evidence items associated w/ source
    var query = {
      "operator": "AND",
      "queries": [
        {"field": "pubmed_id",
          "condition": {
            "name": "is",
            "parameters": [
              source.pubmed_id
            ]
          }
        }],
      "entity": "evidence_items",
      "save": true
    };

    Search.post(query)
      .then(function(response) {
        vm.evidence_items = response.results;
      });

    $scope.$on('suggestion:updated', function() {
      Sources.get(source.id).then(function(response) {
        angular.copy(response, vm.source);
      });
    });


  }
})();
