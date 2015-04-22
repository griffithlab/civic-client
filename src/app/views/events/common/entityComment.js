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
      link: entityCommentLink,
      templateUrl: 'app/views/events/common/entityComment.tpl.html'
    }
  }

  // @ngInject
  function entityCommentLink(scope, element, attributes) {

  }

  // @ngInject
  function EntityCommentController($scope) {
    var ctrl = $scope.ctrl = {};
    ctrl.comment = $scope.commentData;
  }
})();
