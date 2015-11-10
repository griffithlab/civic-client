(function () {
  'use strict';
  angular.module('civic.add')
    .config(CommunityMainConfig)
    .controller('CommunityMainController', CommunityMainController);

  // @ngInject
  function CommunityMainConfig($stateProvider, $resourceProvider) {
    // TODO: toggle trailing-slash trim after civic-server configured to accept either
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $stateProvider
      .state('community.main', {
        url: '/main',
        templateUrl: 'app/views/community/main/CommunityMain.tpl.html',
        resolve: {
          Users: 'Users',
          Community: 'Community'
        },
        controller: 'CommunityMainController',
        controllerAs: 'vm',
        data: {
          navMode: 'sub',
          title: 'Community'
        }
      });
  }

  // @ngInject
  function CommunityMainController($scope,
                                   $stateParams,
                                   _,
                                   Security,
                                   Community,
                                   Users) {
    var vm = this;
    vm.isEditor = Security.isEditor();
    vm.isAuthenticated = Security.isAuthenticated();
    vm.leaderboards = {
      comments: [
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }, {
          "id": 2,
          "email": "jmcmichael@gmail.com",
          "name": "Joshua McMichael",
          "last_seen_at": null,
          "username": null,
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "Joshua McMichael"
        },
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }, {
          "id": 2,
          "email": "jmcmichael@gmail.com",
          "name": "Joshua McMichael",
          "last_seen_at": null,
          "username": null,
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "Joshua McMichael"
        },
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }
      ],
      submissions: [{
        "id": 1,
        "email": "josh@jmcmichael.com",
        "name": "Joshua McMichael",
        "last_seen_at": "2015-11-10T16:08:30.496Z",
        "username": "jmcmichael",
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
          "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
          "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "jmcmichael"
      }, {
        "id": 2,
        "email": "jmcmichael@gmail.com",
        "name": "Joshua McMichael",
        "last_seen_at": null,
        "username": null,
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=128",
          "x64": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=64",
          "x32": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
          "x14": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "Joshua McMichael"
      },
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }, {
          "id": 2,
          "email": "jmcmichael@gmail.com",
          "name": "Joshua McMichael",
          "last_seen_at": null,
          "username": null,
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "Joshua McMichael"
        },
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }

      ],
      suggested_changes: [{
        "id": 1,
        "email": "josh@jmcmichael.com",
        "name": "Joshua McMichael",
        "last_seen_at": "2015-11-10T16:08:30.496Z",
        "username": "jmcmichael",
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
          "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
          "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "jmcmichael"
      }, {
        "id": 2,
        "email": "jmcmichael@gmail.com",
        "name": "Joshua McMichael",
        "last_seen_at": null,
        "username": null,
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=128",
          "x64": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=64",
          "x32": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
          "x14": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "Joshua McMichael"
      },
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }, {
          "id": 2,
          "email": "jmcmichael@gmail.com",
          "name": "Joshua McMichael",
          "last_seen_at": null,
          "username": null,
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "Joshua McMichael"
        },
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }

      ],
      most_moderations: [{
        "id": 1,
        "email": "josh@jmcmichael.com",
        "name": "Joshua McMichael",
        "last_seen_at": "2015-11-10T16:08:30.496Z",
        "username": "jmcmichael",
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
          "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
          "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "jmcmichael"
      }, {
        "id": 2,
        "email": "jmcmichael@gmail.com",
        "name": "Joshua McMichael",
        "last_seen_at": null,
        "username": null,
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=128",
          "x64": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=64",
          "x32": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
          "x14": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "Joshua McMichael"
      },
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }, {
          "id": 2,
          "email": "jmcmichael@gmail.com",
          "name": "Joshua McMichael",
          "last_seen_at": null,
          "username": null,
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "Joshua McMichael"
        },
        {
          "id": 1,
          "email": "josh@jmcmichael.com",
          "name": "Joshua McMichael",
          "last_seen_at": "2015-11-10T16:08:30.496Z",
          "username": "jmcmichael",
          "role": "curator",
          "avatar_url": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
          "avatars": {
            "x128": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=128",
            "x64": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=64",
            "x32": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=32",
            "x14": "https://secure.gravatar.com/avatar/4a8d74f9d60266ac75ee499c3d9b02e2.png?d=identicon\u0026r=pg\u0026s=14"
          },
          "area_of_expertise": null,
          "orcid": null,
          "display_name": "jmcmichael"
        }
      ]

    };
    //Community.getLeaderboards()
    //  .then(function(response) {
    //    angular.copy(vm.leaderboards, response);
    //  });

  }

})();
