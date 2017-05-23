(function() {
  'use strict';
  angular.module('civic.pages')
    .controller('HomeCtrl', HomeCtrl);

  // @ngInject
  function HomeCtrl($scope, $interval, $rootScope, Stats, Events) {
    if($rootScope._civicStateError) {
      var callback;
      callback = $scope.$on('$viewContentLoaded', function(){
        console.alert('Civic has encountered an error loading the requested page\nYou have been returned to the home page\nPlease try again later');
        console.log('Failed transition to state: ', $rootScope._civicStateError);
        $rootScope._civicStateError = undefined;
        (function(){ return callback; })();
      });
    }
    var vm = $scope.vm = {};

    vm.stats = {};
    vm.events = [];

    Stats.site().then(function(stats) {
      vm.stats = stats;
    });
    Events.query({count: 7}).then(function(response) {
      vm.events = response.result;
    });

    // refresh stats and events periodically
    var query = $interval(function() {
      Stats.site().then(function(stats) {
        vm.stats = stats;
      });
      Events.query({count: 7}).then(function(response) {
        vm.events = response.result;
      });
    }, 60000);

    $scope.$on('$destroy', function() {
      console.log('destroying events query');
      if(angular.isDefined(query)) { $interval.cancel(query); }
    });

  }
})();
