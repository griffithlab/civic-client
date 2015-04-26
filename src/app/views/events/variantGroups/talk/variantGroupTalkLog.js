(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .controller('VariantGroupTalkLogController', VariantGroupTalkLogController)
    .directive('variantGroupTalkLog', variantGroupTalkLogDirective);

  // @ngInject
  function variantGroupTalkLogDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: '^^entityTalkView',
      link: variantGroupTalkLogLink,
      controller: 'VariantGroupTalkLogController',
      templateUrl: 'app/views/events/variantGroups/talk/variantGroupTalkLog.tpl.html'
    }
  }

  // @ngInject
  function variantGroupTalkLogLink(scope, element, attrs, entityTalkView) {
    scope.entityTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function VariantGroupTalkLogController($scope, _) {
    var ctrl = $scope.ctrl = {}; // create ctrl here, link function will attach entityTalkView after DOM rendered.
    var comments, revisions, changes;

    var unwatch = $scope.$watch('entityTalkModel', function(entityTalkModel) {
      comments = _.merge({}, entityTalkModel.data.comments);
      revisions = _.merge({}, entityTalkModel.data.revisions);
      changes = _.merge({}, entityTalkModel.data.changes);

      comments = _.map(comments, function(comment) {
        comment.type = 'comment';
        return comment;
      });

      revisions = _.map(revisions, function(revision) {
        revision.type = 'revision';
        return revision;
      });

      changes = _.map(changes, function(change) {
        change.tyep='change'
        return change;
      });

      // concatenate event arrays, sort by date descending
      ctrl.logItems = comments.concat(revisions, changes);
      ctrl.logItems = _.chain(ctrl.logItems)
        .map(function(item) {
          // revisions can have an .user attribute that's just a string
          item.username = typeof item.user === 'object' ? item.user.username : item.user;
          // some items have both created_at and updated_at, we'll favor updated_at
          item.timestamp = _.has(item, 'updated_at') ? item.updated_at : item.created_at;
          return item;
        })
        .sortBy(function(item) {
          return new Date(item.timestamp);
        })
        .reverse()
        .value();
      unwatch(); // bind once then unwatch
    });
  }


})();
