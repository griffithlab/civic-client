(function() {
  'use strict';
  angular.module('civic.sources')
    .controller('SourcesSummaryController', SourcesSummaryController);

  // @ngInject
  function SourcesSummaryController($scope, source) {
    console.log('SourcesSummaryController called.');
    var vm = $scope.vm = {};
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

    vm.source = source;
  }
})();
