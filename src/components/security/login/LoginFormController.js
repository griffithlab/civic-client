(function() {
  'use strict';
  angular.module('civic.security.login.form', [])
    .controller('LoginFormController', LoginFormController);

  /**
   * @name LoginFormController
   * @desc provides the behaviour behind a reusable form to allow users to authenticate. This controller and
   * its template (login/form.tpl.html) are used in a modal dialog box by the security service.
   * @param $scope
   * @param security
   * @constructor
   * @ngInject
   */
  function LoginFormController($scope, Security, $location) {
    var url = $location.url();
    $scope.cancelLogin = function() {
      Security.cancelLogin(url);
    };
  }
})();
