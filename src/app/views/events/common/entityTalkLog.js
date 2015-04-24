(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkLogController', EntityTalkLogController)
    .directive('entityTalkLog', entityTalkLogDirective);

  // @ngInject
  function entityTalkLogDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: '^^entityTalkView',
      link: entityTalkLogLink,
      controller: 'EntityTalkLogController',
      templateUrl: 'app/views/events/common/entityTalkLog.tpl.html'
    }
  }

  // @ngInject
  function entityTalkLogLink(scope, element, attrs, entityTalkView) {
    scope.ctrl.entityTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function EntityTalkLogController($scope, _) {
    var ctrl,
      comments,
      changes,
      revisions,
      entityTalkModel;

    ctrl = $scope.ctrl = {}; // create ctrl here, link function will attach entityTalkView after DOM rendered.

    var unwatch = $scope.$watch('ctrl.entityTalkModel', function(entityTalkModel) {
      comments = entityTalkModel.data.comments;
      revisions = entityTalkModel.data.revisions;
      changes = entityTalkModel.data.changes;

      _.each(comments, function(comment) {
        comment.type = 'comment';
      });

      _.each(revisions, function(revision) {
        revision.type = 'revision';
      });

      _.each(changes, function(change) {
        change.type = 'change';
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
