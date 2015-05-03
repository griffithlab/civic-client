(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneTalkLogController', GeneTalkLogController)
    .directive('geneTalkLog', geneTalkLogDirective);

  // @ngInject
  function geneTalkLogDirective() {
    return {
      restrict: 'E',
      scope: {},
      link: geneTalkLogLink,
      controller: 'GeneTalkLogController',
      templateUrl: 'app/views/events/genes/talk/geneTalkLog.tpl.html'
    }
  }

  // @ngInject
  function geneTalkLogLink(scope, element, attrs) {

  }

  // @ngInject
  function GeneTalkLogController($scope, _,
                                 Genes,
                                 GeneRevisions,
                                 GeneHistory) {
    var ctrl = $scope.ctrl = {}; // create ctrl here, link function will attach entityTalkView after DOM rendered.
    var comments, revisions, history;

    comments = _.merge({}, Genes.data.comments);
    revisions = _.merge({}, GeneRevisions.data.collection);
    history = _.merge({}, GeneHistory.data.collection);

    comments = _.map(comments, function(comment) {
      comment.type = 'comment';
      return comment;
    });

    revisions = _.map(revisions, function(revision) {
      revision.type = 'revision';
      return revision;
    });

    history = _.map(history, function(change) {
      change.type='history'
      return change;
    });


    // concatenate event arrays, sort by date descending
    ctrl.logItems = comments.concat(revisions, history);
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
  }
})();
