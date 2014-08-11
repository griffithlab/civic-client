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
function LoginFormController($scope, SecurityService) {
  // The model for this form
  $scope.user = {};

  // Any error message from failing to login
  $scope.authError = null;

  // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
  // We could do something diffent for each reason here but to keep it simple...
  $scope.authReason = null;
  if ( SecurityService.getLoginReason() ) {
    $scope.authReason = ( SecurityService.isAuthenticated() ) ?
      'NOT AUTHORIZED' :
      'NOT AUTHENTICATED';
  }

  // Attempt to authenticate the user specified in the form's model
  $scope.login = function() {
    // Clear any previous SecurityService errors
    $scope.authError = null;

    // Try to login
    SecurityService.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
      if ( !loggedIn ) {
        // If we get here then the login failed due to bad credentials
        $scope.authError = 'INVALID CREDENTIALS';
      }
    }, function() {
      // If we get here then there was a problem with the login request to the server
      $scope.authError = 'SERVER ERROR';
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };

  $scope.cancelLogin = function() {
    SecurityService.cancelLogin();
  };
}