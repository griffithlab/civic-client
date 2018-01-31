(function() {
  'use strict';
  angular.module('civic.config')
    .config(commentConfig);

  // @ngInject
  function commentConfig(formlyConfigProvider) {
    var _ = window._;
    formlyConfigProvider.setType({
      name: 'comment',
      template: '<textarea class="form-control" ng-model="model[options.key]"></textarea>',
      defaultOptions: {
        ngModelAttrs: {
          rows: {attribute: 'rows'},
          cols: {attribute: 'cols'}
        }
      },
      // these wrappers must be included in this exact order for the mentio menus to work
      // i have no idea why this is the case.
      wrapper: ['horizontalBootstrapComment', 'bootstrapHasError', 'mentioCommentMenus'],
      data: {
        users: [],
        entities: []
      },
      controller: /* @ngInject */ function($scope, $filter, CommentSuggestions) {
        $scope.searchUsers = function(term) {
          if(term.length > 0) {
            CommentSuggestions.getUserSuggestions(term).then(function(response) {
              $scope.users = response;
            });
          }
        };

        $scope.getUser = function(user) {
          return '@' + user.display_name;
        };

        $scope.searchEntities = function(term) {
          if(term.length > 0) {
            CommentSuggestions.getEntitySuggestions(term).then(function(response) {
              $scope.entities = _.map(response, function(entity) {
                entity.display_type = $filter('keyToLabel')(entity.type).toUpperCase();
                return entity;
              });
            });
          }
        };

        $scope.getEntity= function(entity) {
          var types = {
            gene: 'G',
            variant: 'V',
            variant_group: 'VG',
            evidence_item: 'E',
            suggested_change: 'R'
          };
          return '#' + types[entity.type] + entity.id;
        };

        $scope.typedTerm = '';
      }
    });

    formlyConfigProvider.setType({
      name: 'horizontalCommentHelp',
      extends: 'comment',
      wrapper: ['validationMessages', 'horizontalBootstrapHelp']
    });
  }

})();
