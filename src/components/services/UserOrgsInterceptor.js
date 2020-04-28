(function() {
  angular.module('civic.services')
    .constant('UserOrgsInterceptor', UserOrgsInterceptor );

  function UserOrgsInterceptor(response) {
    var user = response.data;
    if(_.isNull(user.most_recent_organization)) { // most_recent_org not defined
      if(!_.isEmpty(user.organizations)) { // is a member of at least one org
        // assign u.orgs[0] to most_recent_org
        user.most_recent_organization = user.organizations[0];
      } else { /* no orgs, most_recent remains null */ }
    } else { // most_recent_org is defined, ensure it's also present in user.orgs array
      var orgId = user.most_recent_organization.id;
      if (!_.some(user.organizations, { id: orgId })) { // user is not currently member of most_recent_org
        if(!_.isEmpty(user.organizations)) { // user is a member of at least one org, assign the first one
          user.most_recent_organization = user.organizations[0];
        } else { // cannot find any current org, remove most_recent_org
          user.most_recent_organization = null;
        }
      }
    }
    return user;
  };

})();
