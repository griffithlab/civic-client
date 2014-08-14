angular.module('civic.security.authorization', ['civic.security.service'])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
  .provider('Authorization', {
    requireAdminUser: function(Authorization) {
      return Authorization.requireAdminUser();
    },

    requireAuthenticatedUser: function(Authorization) {
      return Authorization.requireAuthenticatedUser();
    },

    $get: function(SecurityService, RetryQueue) {
      console.log('Authorization.$get() called.');
      var service = {

        // Require that there is an authenticated user
        // (use this in a route resolve to prevent non-authenticated users from entering that route)
        requireAuthenticatedUser: function() {
          var promise = SecurityService.requestCurrentUser().then(function(userInfo) {
            if ( !SecurityService.isAuthenticated() ) {
              return RetryQueue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
            }
          });
          return promise;
        },

        // Require that there is an administrator logged in
        // (use this in a route resolve to prevent non-administrators from entering that route)
        requireAdminUser: function() {
          var promise = SecurityService.requestCurrentUser().then(function(userInfo) {
            if ( !SecurityService.isAdmin() ) {
              return RetryQueue.pushRetryFn('unauthorized-client', service.requireAdminUser);
            }
          });
          return promise;
        }

      };

      return service;
    }
  });