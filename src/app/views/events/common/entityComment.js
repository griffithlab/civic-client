(function() {
  angular.module('civic.events.common')
    .directive('entityComment', entityCommentDirective)
    .controller('EntityCommentController', EntityCommentController);

  // @ngInject
  function entityCommentDirective() {
    return {
      restrict: 'E',
      scope: {
        commentData: '='
      },
      controller: 'EntityCommentController',
      templateUrl: 'app/views/events/common/entityComment.tpl.html'
    }
  }

  // @ngInject
  function EntityCommentController($scope, Security) {
    var ctrl = $scope.ctrl = {};
    ctrl.security = {
      isAuthenticated: Security.isAuthenticated(),
      isAdmin: Security.isEditor()
    };

    ctrl.comment = $scope.commentData;
  }
})();
