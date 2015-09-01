(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HelpCtrl', HelpCtrl);

  // @ngInject
  function HelpCtrl($scope) {
    var vm = $scope.vm = {};
    vm.tabs = [

      {
        heading: 'Evidence Item',
        template: 'app/pages/help_evidence_statement.tpl.html',
        active: true
      },
      {
        heading: 'Evidence Types',
        template: 'app/pages/help_evidence_types.tpl.html',
        active: false
      },
      {
        heading: 'Evidence Levels',
        template: 'app/pages/help_evidence_levels.tpl.html',
        active: false
      },
      {
        heading: 'Trust Ratings',
        template: 'app/pages/help_trust_ratings.tpl.html',
        active: false
      }
    ];
  }
})();
