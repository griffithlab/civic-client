(function() {
  'use strict';
  angular.module('civic.services')
    .factory('CommentPreviewResource', CommentPreviewResource)
    .factory('CommentPreview', CommentPreviewService);

  // @ngInject
  function CommentPreviewResource($resource) {
    return $resource('/api/markdown',
      {},
      {
        preview: {
          method: 'POST',
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function CommentPreviewService(CommentPreviewResource) {
    var preview = '';

    return {
      data: {
        preview: preview
      },
      getPreview: getPreview
    };

    function getPreview(markdown) {
      return CommentPreviewResource.preview({markdown: markdown}).$promise
        .then(function(response) {
          angular.copy(response, preview);
          return response.$promise;
        });
    }
  }
})();
