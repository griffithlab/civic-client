angular.module('civicClient', [
  'ui.router'
  ,'ui.bootstrap'
  ,'civic.security'
  ,'civic.services'
  ,'civic.common'
  ,'civic.pages'
  ,'civic.login'
  ,'civic-client-templates'
])
  .config(appConfig)
  .run(appRun);

angular.module('civic.services', []);
angular.module('civic.common', []);
angular.module('civic.pages', []);
angular.module('civic.login', []);
angular.module('civic.browse', []);
angular.module('civic.search', []);
angular.module('civic.gene', []);
angular.module('civic.event', []);
angular.module('civic.evidence', []);

/**
 * @name appConfig
 * @desc Config function for main app
 * @param $stateProvider
 * @param $urlRouterProvider
 * @ngInject
 *
 */
function appConfig($stateProvider, $urlRouterProvider ) {
  'use strict';
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: '/civic-client/pages/home.html',
      authenticate: true
    })
    .state('login', {
      url: '/login',
      templateUrl: '/civic-client/login/login.html',
      controller: 'LoginCtrl',
      authenticate: false
    });
  // Send to login if the URL was not found
  $urlRouterProvider.otherwise('/home');
}

/**
 * @name appRun
 * @desc run function for main app
 * @ngInject
 */
function appRun($rootScope, $state) {
//  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
//    if (toState.authenticate && !AuthService.isAuthenticated()){
//      // User isn’t authenticated
//      $state.transitionTo("login");
//      event.preventDefault();
//    }
//  });
}
(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/login/login.html',
    '<h1>Login</h1>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/home.html',
    '<h1>Home</h1><session-info></session-info>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/security/login/form.tpl.html',
    '<form name="form" novalidate class="login-form"><div class="modal-header"><h4>Sign in</h4></div><div class="modal-body"><div class="alert alert-warning" ng-show="authReason">{{authReason}}</div><div class="alert alert-error" ng-show="authError">{{authError}}</div><div class="alert alert-info">Please enter your login details</div><label>E-mail</label><input name="login" type="email" ng-model="user.email" required autofocus><label>Password</label><input name="pass" type="password" ng-model="user.password" required></div><div class="modal-footer"><button class="btn btn-primary login" ng-click="login()" ng-disabled="form.$invalid">Sign in</button> <button class="btn clear" ng-click="clearForm()">Clear</button> <button class="btn btn-warning cancel" ng-click="cancelLogin()">Cancel</button></div></form>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/security/login/toolbar.tpl.html',
    '<ul class="nav pull-right"><li class="divider-vertical"></li><li ng-show="isAuthenticated()"><a href="#">{{currentUser.firstName}} {{currentUser.lastName}}</a></li><li ng-show="isAuthenticated()" class="logout"><form class="navbar-form"><button class="btn logout" ng-click="logout()">Log out</button></form></li><li ng-hide="isAuthenticated()" class="login"><form class="navbar-form"><button class="btn login" ng-click="login()">Log in</button></form></li></ul>');
}]);
})();

angular.module('security.authorization', ['security.service'])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
  .provider('AuthService', {

    requireAdminUser: ['AuthService', function(AuthService) {
      return AuthService.requireAdminUser();
    }],

    requireAuthenticatedUser: ['AuthService', function(AuthService) {
      return AuthService.requireAuthenticatedUser();
    }],

    $get: ['security', 'securityRetryQueue', function(security, queue) {
      var service = {

        // Require that there is an authenticated user
        // (use this in a route resolve to prevent non-authenticated users from entering that route)
        requireAuthenticatedUser: function() {
          var promise = security.requestCurrentUser().then(function(userInfo) {
            if ( !security.isAuthenticated() ) {
              return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
            }
          });
          return promise;
        },

        // Require that there is an administrator logged in
        // (use this in a route resolve to prevent non-administrators from entering that route)
        requireAdminUser: function() {
          var promise = security.requestCurrentUser().then(function(userInfo) {
            if ( !security.isAdmin() ) {
              return queue.pushRetryFn('unauthorized-client', service.requireAdminUser);
            }
          });
          return promise;
        }

      };

      return service;
    }]
  });
angular.module('civic.security.retryQueue', [])

// This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
  .factory('RetryQueue', ['$q', '$log', function($q, $log) {
    'use strict';
    var retryQueue = [];
    var service = {
      // The security service puts its own handler in here!
      onItemAddedCallbacks: [],

      hasMore: function() {
        return retryQueue.length > 0;
      },
      push: function(retryItem) {
        retryQueue.push(retryItem);
        // Call all the onItemAdded callbacks
        angular.forEach(service.onItemAddedCallbacks, function(cb) {
          try {
            cb(retryItem);
          } catch(e) {
            $log.error('securityRetryQueue.push(retryItem): callback threw an error' + e);
          }
        });
      },
      pushRetryFn: function(reason, retryFn) {
        // The reason parameter is optional
        if ( arguments.length === 1) {
          retryFn = reason;
          reason = undefined;
        }

        // The deferred object that will be resolved or rejected by calling retry or cancel
        var deferred = $q.defer();
        var retryItem = {
          reason: reason,
          retry: function() {
            // Wrap the result of the retryFn into a promise if it is not already
            $q.when(retryFn()).then(function(value) {
              // If it was successful then resolve our deferred
              deferred.resolve(value);
            }, function(value) {
              // Othewise reject it
              deferred.reject(value);
            });
          },
          cancel: function() {
            // Give up on retrying and reject our deferred
            deferred.reject();
          }
        };
        service.push(retryItem);
        return deferred.promise;
      },
      retryReason: function() {
        return service.hasMore() && retryQueue[0].reason;
      },
      cancelAll: function() {
        while(service.hasMore()) {
          retryQueue.shift().cancel();
        }
      },
      retryAll: function() {
        while(service.hasMore()) {
          retryQueue.shift().retry();
        }
      }
    };
    return service;
  }]);

angular.module('civic.security.login.form', [])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the security service.
  .controller('LoginFormController', ['$scope', 'security', function($scope, security) {
    // The model for this form
    $scope.user = {};

    // Any error message from failing to login
    $scope.authError = null;

    // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
    // We could do something diffent for each reason here but to keep it simple...
    $scope.authReason = null;
    if ( security.getLoginReason() ) {
      $scope.authReason = ( security.isAuthenticated() ) ?
        'NOT AUTHORIZED' :
        'NOT AUTHENTICATED';
    }

    // Attempt to authenticate the user specified in the form's model
    $scope.login = function() {
      // Clear any previous security errors
      $scope.authError = null;

      // Try to login
      security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
        if ( !loggedIn ) {
          // If we get here then the login failed due to bad credentials
          $scope.authError = 'INVALID CREDENTIALS';
        }
      }, function(x) {
        // If we get here then there was a problem with the login request to the server
        $scope.authError = 'SERVER ERROR';
      });
    };

    $scope.clearForm = function() {
      $scope.user = {};
    };

    $scope.cancelLogin = function() {
      security.cancelLogin();
    };
  }]);

angular.module('civic.security.login.toolbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
  .directive('loginToolbar', ['security', function(security) {
    var directive = {
      templateUrl: 'security/login/toolbar.tpl.html',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function($scope, $element, $attrs, $controller) {
        $scope.isAuthenticated = security.isAuthenticated;
        $scope.login = security.showLogin;
        $scope.logout = security.logout;
        $scope.$watch(function() {
          return security.currentUser;
        }, function(currentUser) {
          $scope.currentUser = currentUser;
        });
      }
    };
    return directive;
  }]);
angular.module('civic.common')
  .directive('sessionInfo', sessionInfo);

/**
 * @ngInject
 */
function sessionInfo(ConfigService, $log) {
  'use strict';
  return {
    restrict: 'EA',
    template: '<h2>CIViC Server URL: {{ conf.serverUrl }}</h2>',
    link: function(scope, element, attrs) {
      $log.info('sessionInfo directive loaded.');
      scope.conf = ConfigService;
    }
  };
}
angular.module('civic.security.interceptor', ['civic.security.retryQueue'])

// This http interceptor listens for authentication failures
  // @ngInject
  .factory('securityInterceptor', function($injector, RetryQueue) {
    return function(promise) {
      // Intercept failed requests
      return promise.then(null, function(originalResponse) {
        if(originalResponse.status === 401) {
          // The request bounced because it was not authorized - add a new request to the retry RetryQueue
          promise = RetryQueue.pushRetryFn('unauthorized-server', function retryRequest() {
            // We must use $injector to get the $http service to prevent circular dependency
            return $injector.get('$http')(originalResponse.config);
          });
        }
        return promise;
      });
    };
  })
// We have to add the interceptor to the RetryQueue as a string because the interceptor depends upon service instances that are not available in the config block.
  // @ngInject
  .config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('securityInterceptor');
  });
angular.module('civic.security.login', ['civic.security.login.form', 'civic.security.login.toolbar']);
angular.module('civic.services')
  .constant('ConfigService', {
    serverUrl: 'http://localhost:3000/'
  }
);


angular.module('civic.login')
  .controller('LoginCtrl', LoginCtrl);

/**
 * @ngInject
 */
function LoginCtrl($log) {
  $log.info("LoginCtrl instantiated");
}
angular.module('civic.pages')
  .controller('HomeCtrl', HomeCtrl);

/**
 * @ngInject
 */
function HomeCtrl($log) {
  $log.info("HomeCtrl instantiated");
}
// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('civic.security.service', [
  'civic.security.retryQueue'    // Keeps track of failed requests that need to be retried once the user logs in
  ,'civic.security.login'         // Contains the login form template and controller
  ,'ui.bootstrap.modal'     // Used to display the login form as a modal dialog.
])

  .factory('security', function($http, $q, $location, queue, $modal) {
    'use strict';
    // Redirect to the given url (defaults to '/')
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }

    // Login form dialog stuff
    var loginDialog = null;
    function openLoginDialog() {
      if ( loginDialog ) {
        throw new Error('Trying to open a dialog that is already open!');
      }
      loginDialog = $modal.dialog();
      loginDialog.open('security/login/form.tpl.html', 'LoginFormController').then(onLoginDialogClose);
    }
    function closeLoginDialog(success) {
      if (loginDialog) {
        loginDialog.close(success);
      }
    }
    function onLoginDialogClose(success) {
      loginDialog = null;
      if ( success ) {
        queue.retryAll();
      } else {
        queue.cancelAll();
        redirect();
      }
    }

    // Register a handler for when an item is added to the retry queue
    queue.onItemAddedCallbacks.push(function(retryItem) {
      if ( queue.hasMore() ) {
        service.showLogin();
      }
    });

    // The public API of the service
    var service = {

      // Get the first reason for needing a login
      getLoginReason: function() {
        return queue.retryReason();
      },

      // Show the modal login dialog
      showLogin: function() {
        openLoginDialog();
      },

      // Attempt to authenticate a user by the given email and password
      login: function(email, password) {
        var request = $http.post('/login', {email: email, password: password});
        return request.then(function(response) {
          service.currentUser = response.data.user;
          if ( service.isAuthenticated() ) {
            closeLoginDialog(true);
          }
          return service.isAuthenticated();
        });
      },

      // Give up trying to login and clear the retry queue
      cancelLogin: function() {
        closeLoginDialog(false);
        redirect();
      },

      // Logout the current user and redirect
      logout: function(redirectTo) {
        $http.post('/logout').then(function() {
          service.currentUser = null;
          redirect(redirectTo);
        });
      },

      // Ask the backend to see if a user is already authenticated - this may be from a previous session.
      requestCurrentUser: function() {
        if ( service.isAuthenticated() ) {
          return $q.when(service.currentUser);
        } else {
          return $http.get('/current-user').then(function(response) {
            service.currentUser = response.data.user;
            return service.currentUser;
          });
        }
      },

      // Information about the current user
      currentUser: null,

      // Is the current user authenticated?
      isAuthenticated: function(){
        return !!service.currentUser;
      },

      // Is the current user an adminstrator?
      isAdmin: function() {
        return !!(service.currentUser && service.currentUser.admin);
      }
    };

    return service;
  });

// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('civic.security', [
  'civic.security.service'
  ,'civic.security.interceptor'
  ,'civic.security.login'
  ,'civic.security.authorization'
]);
