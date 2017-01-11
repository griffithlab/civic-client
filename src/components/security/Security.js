// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
(function() {
  'use strict';
  angular.module('civic.security.service', [
    'civic.security.retryQueue',
    'civic.security.login',
    'dialogs.main'
  ])
    .factory('Security', Security);

// @ngInject
  function Security($http, $q, $location, $state, RetryQueue, dialogs, $log) {
    // Redirect to the given url (defaults to '/')
    function redirect(url) {
      url = url || '/';
      $location.url(url);
      $state.reload();
    }

    // Login form dialog stuff
    var loginDialog = null;
    function openLoginDialog() {
      if ( loginDialog ) {
        throw new Error('Trying to open a dialog that is already open!');
      }
      loginDialog= dialogs.create('components/security/login/LoginForm.tpl.html','LoginFormController',{},{backdrop: 'static'});
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
        // redirect();
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
      cancelLogin: function(url) {
        closeLoginDialog(false);
        redirect(url);
      },

      // Logout the current user and redirect
      logout: function(redirectTo) {
        console.log("called logout");
        $http.get('/api/sign_out').then(function() { // success
          console.log("called get");
          service.currentUser = null;
          console.log("set currentUser null");
          redirect(redirectTo);
          console.log("redirected");
        }, function(response) { // failure
          $log.warn('COULD NOT LOG OUT' + JSON.stringify(response));
        });
      },

      // Ask the backend to see if a user is already authenticated - this may be from a previous session.
      requestCurrentUser: function() {
        if ( service.isAuthenticated() ) {
          return $q.when(service.currentUser);
        } else {
          return $http.get('/api/current_user.json').then(function(response) {
            // unauthenticated request returns an empty JSON object, so we count the keys
            // and if there are any we assume an authenticated user
            if(Object.keys(response.data).length > 0) {
              service.currentUser = response.data;
            } else {
              service.currentUser = null;
            }
            return service.currentUser;
          });
        }
      },

      reloadCurrentUser: function() {
        return $http.get('/api/current_user.json').then(function(response) {
          // unauthenticated request returns an empty JSON object, so we count the keys
          // and if there are any we assume an authenticated user
          if(Object.keys(response.data).length > 0) {
            service.currentUser = response.data;
          } else {
            service.currentUser = null;
          }
          return service.currentUser;
        });
      },

      // Information about the current user
      currentUser: null,

      // Is the current user authenticated?
      isAuthenticated: function(){
        return !!service.currentUser;
      },

      // Does the current user have admin privileges?
      isAdmin: function() {
        return !!(service.currentUser && service.currentUser.role === 'admin');
      },

      // Does the current user have editor privileges?
      isEditor: function() {
        return !!(service.currentUser && service.currentUser.role === 'editor');
      },

      // Is the current user an curator?
      isCurator: function() {
        return !!(service.currentUser && (service.currentUser.role === 'curator'));
      }
    };

    return service;
  }
})();
