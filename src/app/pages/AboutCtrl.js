(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('AboutCtrl', AboutCtrl);

// @ngInject
  function AboutCtrl ($scope, $modal) {
    var vm = $scope.vm = {};

    vm.contributors = [{
      "id": 103,
      "email": "user_1@example.com",
      "name": null,
      "last_seen_at": null,
      "username": "User 1",
      "role": "curator",
      "avatar_url": "https://secure.gravatar.com/avatar/be72a6287c41316db75b7bc8020024c8.png?d=identicon&r=pg&s=32",
      "avatars": {
        "x128": "https://secure.gravatar.com/avatar/be72a6287c41316db75b7bc8020024c8.png?d=identicon&r=pg&s=128",
        "x64": "https://secure.gravatar.com/avatar/be72a6287c41316db75b7bc8020024c8.png?d=identicon&r=pg&s=64",
        "x32": "https://secure.gravatar.com/avatar/be72a6287c41316db75b7bc8020024c8.png?d=identicon&r=pg&s=32",
        "x14": "https://secure.gravatar.com/avatar/be72a6287c41316db75b7bc8020024c8.png?d=identicon&r=pg&s=14"
      },
      "area_of_expertise": null,
      "orcid": null,
      "display_name": "User 1",
      "community_params": {
        "most_recent_action_timestamp": null,
        "action_count": 0
      }
    },
      {
        "id": 104,
        "email": "user_2@example.com",
        "name": null,
        "last_seen_at": null,
        "username": "User 2",
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/de54c9567234025a4b326d7882e91ce4.png?d=identicon&r=pg&s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/de54c9567234025a4b326d7882e91ce4.png?d=identicon&r=pg&s=128",
          "x64": "https://secure.gravatar.com/avatar/de54c9567234025a4b326d7882e91ce4.png?d=identicon&r=pg&s=64",
          "x32": "https://secure.gravatar.com/avatar/de54c9567234025a4b326d7882e91ce4.png?d=identicon&r=pg&s=32",
          "x14": "https://secure.gravatar.com/avatar/de54c9567234025a4b326d7882e91ce4.png?d=identicon&r=pg&s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "User 2",
        "community_params": {
          "most_recent_action_timestamp": null,
          "action_count": 0
        }
      },
      {
        "id": 105,
        "email": "user_3@example.com",
        "name": null,
        "last_seen_at": null,
        "username": "User 3",
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/64bf6b54ba4b065b5f45e5187756870a.png?d=identicon&r=pg&s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/64bf6b54ba4b065b5f45e5187756870a.png?d=identicon&r=pg&s=128",
          "x64": "https://secure.gravatar.com/avatar/64bf6b54ba4b065b5f45e5187756870a.png?d=identicon&r=pg&s=64",
          "x32": "https://secure.gravatar.com/avatar/64bf6b54ba4b065b5f45e5187756870a.png?d=identicon&r=pg&s=32",
          "x14": "https://secure.gravatar.com/avatar/64bf6b54ba4b065b5f45e5187756870a.png?d=identicon&r=pg&s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "User 3",
        "community_params": {
          "most_recent_action_timestamp": null,
          "action_count": 0
        }
      },
      {
        "id": 106,
        "email": "user_4@example.com",
        "name": null,
        "last_seen_at": null,
        "username": "User 4",
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/1d0a8474488144f248722d20e9fd0e24.png?d=identicon&r=pg&s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/1d0a8474488144f248722d20e9fd0e24.png?d=identicon&r=pg&s=128",
          "x64": "https://secure.gravatar.com/avatar/1d0a8474488144f248722d20e9fd0e24.png?d=identicon&r=pg&s=64",
          "x32": "https://secure.gravatar.com/avatar/1d0a8474488144f248722d20e9fd0e24.png?d=identicon&r=pg&s=32",
          "x14": "https://secure.gravatar.com/avatar/1d0a8474488144f248722d20e9fd0e24.png?d=identicon&r=pg&s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "User 4",
        "community_params": {
          "most_recent_action_timestamp": null,
          "action_count": 0
        }
      },
      {
        "id": 107,
        "email": "user_5@example.com",
        "name": null,
        "last_seen_at": null,
        "username": "User 5",
        "role": "curator",
        "avatar_url": "https://secure.gravatar.com/avatar/2ff2d013dd15c65ee144645b507a6542.png?d=identicon&r=pg&s=32",
        "avatars": {
          "x128": "https://secure.gravatar.com/avatar/2ff2d013dd15c65ee144645b507a6542.png?d=identicon&r=pg&s=128",
          "x64": "https://secure.gravatar.com/avatar/2ff2d013dd15c65ee144645b507a6542.png?d=identicon&r=pg&s=64",
          "x32": "https://secure.gravatar.com/avatar/2ff2d013dd15c65ee144645b507a6542.png?d=identicon&r=pg&s=32",
          "x14": "https://secure.gravatar.com/avatar/2ff2d013dd15c65ee144645b507a6542.png?d=identicon&r=pg&s=14"
        },
        "area_of_expertise": null,
        "orcid": null,
        "display_name": "User 5",
        "community_params": {
          "most_recent_action_timestamp": null,
          "action_count": 0
        }
      }
    ];
  }
})();
