(function() {
  'use strict';
  angular.module('civic.config')
    .config(ratingConfig);

  // @ngInject
  function ratingConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'rating',
      templateUrl: 'components/forms/fieldTypes/rating.tpl.html',
      controller: /* @ngInject */ function($scope) {
        $scope.overStar = $scope.model.rating;
        $scope.hoveringOver= function(value) {
          $scope.overStar = value;
        };

        $scope.leave = function() {
          $scope.model.rating === 0 ? $scope.overStar = 0 : $scope.overStar = $scope.model.rating;
        };
      }
    });

    formlyConfigProvider.setType({
      name: 'horizontalRating',
      extends: 'rating',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalRatingHelp',
      extends: 'rating',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });

  }

})();
