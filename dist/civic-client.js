angular.module('civic.security.login', ['civic.security.login.form', 'civic.security.login.toolbar']);
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
function LoginFormController($scope, Security) {
  'use strict';
  // The model for this form
  $scope.user = {};

  // Any error message from failing to login
  $scope.authError = null;

  // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
  // We could do something different for each reason here but to keep it simple...
  $scope.authReason = null;
  if ( Security.getLoginReason() ) {
    $scope.authReason = ( Security.isAuthenticated() ) ?
      'NOT AUTHORIZED' :
      'NOT AUTHENTICATED';
  }

  // Attempt to authenticate the user specified in the form's model
  $scope.login = function() {
    // Clear any previous Security errors
    $scope.authError = null;

    // Try to login
    Security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
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
    Security.cancelLogin();
  };
}
angular.module('civicClient', [
  'ui.router'
  ,'ui.bootstrap'
  ,'dialogs.main'
  ,'civic.pages'
  ,'civic.security'
  ,'civic.services'
  ,'civic.common'
  ,'civic.login'
  ,'civic-client-templates'
])
  .config(appConfig)
  .run(appRun);

/**
 * @name appConfig
 * @desc Config function for main app
 * @param $log
 * @param $stateProvider
 * @param $urlRouterProvider
 * @ngInject
 *
 */
function appConfig($stateProvider, $urlRouterProvider) {
  'use strict';
  $urlRouterProvider.otherwise('home');
}

function appRun(Security) {
  'use strict';
  Security.requestCurrentUser();
}

// define app modules
angular.module('civic.security', [
  'civic.security.authorization'
  ,'civic.security.service'
  ,'civic.security.interceptor'
  ,'civic.security.login'
]);
angular.module('civic.services', []);
angular.module('civic.pages', ['civic.security.authorization']);
angular.module('civic.common', []);
angular.module('civic.login', []);
angular.module('civic.browse', []);
angular.module('civic.search', []);
angular.module('civic.gene', []);
angular.module('civic.event', []);
angular.module('civic.evidence', []);

angular.module('civic.pages')
  .controller('HomeCtrl', HomeCtrl);

/**
 * @ngInject
 */
function HomeCtrl($rootScope, $scope, $log) {
  'use strict';
  $log.info('HomeCtrl instantiated');
  $rootScope.navMode = 'home';
  $rootScope.pageTitle = 'Home';
  $scope.loadedMsg = 'Loaded Home!';
}


angular
  .module('civic.pages')
  .controller('AuthTestCtrl', AuthTestCtrl);

function AuthTestCtrl ($scope, $rootScope, $log) {
  'use strict';
  $log.info('AuthTestCtrl loaded.');
  $rootScope.navMode = 'sub';
  $rootScope.pageTitle = 'AuthTest';
  $log.info('AuthTest loaded.');
  $scope.loadedMsg = 'Loaded AuthTest!';
}

angular.module('civic.services')
  .constant('ConfigService', {
    serverUrl: 'http://localhost:3000/',
    mainMenuItems: [
      {
        label: 'Home',
        state: 'home'
      },
      {
        label: 'Auth Test',
        state: 'authTest'
      }
    ]
  }
);


// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('civic.security.service', [
  'civic.security.retryQueue'
  ,'civic.security.login'
  ,'dialogs.main'
])
  .factory('Security', Security);

// @ngInject
function Security($http, $q, $location, RetryQueue, dialogs, $log) {
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
    loginDialog= dialogs.create('common/security/login/LoginForm.tpl.html','LoginFormController',{},'lg');
    loginDialog.result.then(onLoginDialogClose);
  }
  function closeLoginDialog(success) {
    $log.info('Security.closeLoginDialog() called.');
    if (loginDialog) {
      loginDialog.close(success);
    }
  }
  function onLoginDialogClose(success) {
    loginDialog = null;
    if ( success ) {
      RetryQueue.retryAll();
    } else {
      RetryQueue.cancelAll();
      redirect();
    }
  }

  // Register a handler for when an item is added to the retry queue
  RetryQueue.onItemAddedCallbacks.push(function() {
    if ( RetryQueue.hasMore() ) {
      service.showLogin();
    }
  });

  // The public API of the service
  var service = {

    // Get the first reason for needing a login
    getLoginReason: function() {
      return RetryQueue.retryReason();
    },

    // Show the modal login dialog
    showLogin: function() {
      openLoginDialog();
    },

    // Attempt to authenticate a user by the given email and password
    login: function() {
      var request = $http.get('/api/current_user.json');
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
      $http.get('/api/sign_out').then(function() {
        service.currentUser = null;
        redirect(redirectTo);
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/api/current_user.json').then(function(response) {
          service.currentUser = response.data;
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
}

angular.module('civic.security.retryQueue', [])
  .factory('RetryQueue', RetryQueue);

/**
 * @name RetryQueue
 * @desc This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
 * @param $q
 * @param $log
 * @returns {{onItemAddedCallbacks: Array, hasMore: hasMore, push: push, pushRetryFn: pushRetryFn, retryReason: retryReason, cancelAll: cancelAll, retryAll: retryAll}}
 * @ngInject
 */
function RetryQueue($q, $log) {
  'use strict';
  var retryQueue = [];
  var service = {
    // The security service puts its own handler in here!
    onItemAddedCallbacks: [],

    hasMore: function() {
      return retryQueue.length > 0;
    },
    push: function(retryItem) {
      $log.info('retryQueue.push() called with item: ' + retryItem);
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
      $log.info('RetryQueue.retryall() called.');
      while(service.hasMore()) {
        retryQueue.shift().retry();
      }
    }
  };
  return service;
}

angular.module('civic.security.interceptor', ['civic.security.retryQueue'])
  .factory('Interceptor', Interceptor)
  .config(interceptorServiceConfig);

/**
 * @name Interceptor
 * @desc listens for authentication failures
 * @param $injector
 * @param RetryQueue
 * @returns {Function}
 * @ngInject
 */
function Interceptor($injector, RetryQueue) {
  'use strict';
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
}

/**
 * @name interceptorServiceConfig
 * @desc We have to add the interceptor to the RetryQueue as a string because the interceptor depends upon service instances that are not available in the config block.
 * @param $httpProvider
 */
function interceptorServiceConfig($httpProvider) {
  'use strict';
  $httpProvider.responseInterceptors.push('Interceptor');
}

angular.module('civic.security.authorization', ['civic.security.service'])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
  .provider('Authorization', {
    requireAdminUser: function(Authorization) {
      'use strict';
      return Authorization.requireAdminUser();
    },

    requireAuthenticatedUser: function(Authorization) {
      'use strict';
      return Authorization.requireAuthenticatedUser();
    },

    $get: function(Security, RetryQueue) {
      'use strict';
      var service = {

        // Require that there is an authenticated user
        // (use this in a route resolve to prevent non-authenticated users from entering that route)
        requireAuthenticatedUser: function() {
          var promise = Security.requestCurrentUser().then(function() {
            if ( !Security.isAuthenticated() ) {
              return RetryQueue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
            }
          });
          return promise;
        },

        // Require that there is an administrator logged in
        // (use this in a route resolve to prevent non-administrators from entering that route)
        requireAdminUser: function() {
          var promise = Security.requestCurrentUser().then(function() {
            if ( !Security.isAdmin() ) {
              return RetryQueue.pushRetryFn('unauthorized-client', service.requireAdminUser);
            }
          });
          return promise;
        }

      };

      return service;
    }
  });
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
    link: function(scope) {
      $log.info('sessionInfo directive loaded.');
      scope.conf = ConfigService;
    }
  };
}
angular.module('civic.common')
  .directive('mainMenu', mainMenu);
/**
 * @name mainMenu
 * @desc generates the app main menu
 * @returns {{restrict: string, templateUrl: string, replace: boolean, scope: boolean}}
 * @ngInject
 */
function mainMenu() {
  'use strict';

  function mainMenuController($scope, ConfigService) {
    $scope.menuItems = ConfigService.mainMenuItems;
  }

  var directive = {
    restrict: 'E',
    templateUrl: 'common/directives/mainMenu.tpl.html',
    replace: true,
    scope: true,
    controller: mainMenuController
  };

  return directive;
}
angular.module('civic.security.login.toolbar', [])
  .directive('loginToolbar', loginToolbar);

/**
 * @name loginToolbar
 * @desc The loginToolbar directive is a reusable widget that can show login or logout
 * buttons and information the current authenticated user
 * @param Security
 * @returns {{templateUrl: string, restrict: string, replace: boolean, scope: boolean, link: link}}
 * @ngInject
 */
function loginToolbar(Security) {
  'use strict';
  var directive = {
    templateUrl: 'common/directives/loginToolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope) {
      $scope.isAuthenticated = Security.isAuthenticated;
      $scope.login = Security.showLogin;
      $scope.logout = Security.logout;
      $scope.$watch(function() {
        return Security.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  };
  return directive;
}
angular.module('civic.common')
  .directive('civicLogo', civicLogo);

/**
 * @ngInject
 */
function civicLogo($scope, $rootScope, $log) {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'common/directives/civicLogo.tpl.html',
    controller: civicLogoController
  };

  function civicLogoController($log) {
    'use strict';
    $log.info('civicLogoController loaded');
    $scope.pageState = {
      navMode: $rootScope.navMode,
      pageTitle: $rootScope.pageTitle
    }
  }

  return directive;
}
angular.module('civic.pages')
  .config(pagesConfig);

// @ngInject
function pagesConfig($stateProvider, AuthorizationProvider) {
  'use strict';
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: '/civic-client/pages/home/home.tpl.html'
    })
    .state('authTest', {
      url: '/authTest',
      controller: 'AuthTestCtrl',
      templateUrl: '/civic-client/pages/authTest/authTest.tpl.html',
      resolve: {
        authorized: AuthorizationProvider.requireAuthenticatedUser
      }
    });
}

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/directives/civicLogo.tpl.html',
    '<div class="civicLogo"><a ui-sref="home"><div ng-switch on="pageState.navMode"><span ng-switch-when="home"><img src="assets/images/CIViC_logo@2x.png" alt="CIViC: Clinical Interpretations of Variations in Cancer" width="375" height="240"></span> <span ng-switch-when="sub"><img src="assets/images/CIViC_logo_sm@2x.png" alt="CIViC: Clinical Interpretations of Variations in Cancer" width="155" height="76"></span></div></a></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/directives/loginToolbar.tpl.html',
    '<div class="loginToolbar"><ul><li ng-show="isAuthenticated()"><a href="#">{{currentUser.name}} {{currentUser.lastName}}</a></li><li ng-show="isAuthenticated()" class="logout"><form class="navbar-form"><button class="btn logout" ng-click="logout(\'home\')">Log out</button></form></li><li ng-hide="isAuthenticated()" class="login"><form class="navbar-form"><button class="btn login" ng-click="login()">Log in</button></form></li></ul></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/directives/mainMenu.tpl.html',
    '<div class="mainMenu"><ul><li ng-repeat="item in menuItems" ui-sref-active="active"><a ui-sref="{{ item.state}}">{{ item.label }}</a></li></ul></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/authTest/authTest.tpl.html',
    '<h1>Requires Auth</h1>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/home/home.tpl.html',
    '<h1>Home</h1>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/security/login/LoginForm.tpl.html',
    '<form name="form" novalidate class="login-form"><div class="modal-header"><h4>Sign in</h4></div><div class="modal-body"><div class="alert alert-warning" ng-show="authReason">{{authReason}}</div><div class="alert alert-error" ng-show="authError">{{authError}}</div><div class="alert alert-info">Login by choosing one of the methods below:</div><ul><li><a href="api/auth/github">Login with Github</a></li></ul></div><div class="modal-footer"><button class="btn btn-warning cancel" ng-click="cancelLogin()">Cancel</button></div></form>');
}]);
})();
