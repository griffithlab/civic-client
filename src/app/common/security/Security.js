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
  RetryQueue.onItemAddedCallbacks.push(function(retryItem) {
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
    login: function(email, password) {
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
