'use strict';
describe('VariantGroupsService', function() {
  var $httpBackend,
    servedVariantGroup1,
    servedVariantGroups,
    VariantGroups;

  beforeEach(module('civic.services'));
  beforeEach(module('served/variantGroups.json'));
  beforeEach(module('served/variantGroup1.json'));
  beforeEach(module('served/variantGroup1Comments.json'));
  beforeEach(module('served/variantGroup1AddCommentResponse.json'));
  beforeEach(module('served/variantGroup1Comment1.json'));
  beforeEach(module('served/variantGroup1UpdateComment1Response.json'));
  beforeEach(module('served/variantGroup1UpdatedResponse.json'));
  beforeEach(module('served/variantGroup1Revisions.json'));
  beforeEach(module('served/variantGroup1RevisionsLast.json'));
  beforeEach(module('served/variantGroup1SuggestedChanges.json'));
  beforeEach(module('served/variantGroup1SuggestedChangeSubmitResponse.json'));
  beforeEach(module('served/variantGroup1SuggestedChange7.json'));

  beforeEach(inject(function($injector,
                             servedVariantGroup1,
                             servedVariantGroups,
                             servedVariantGroup1Comments,
                             servedVariantGroup1AddCommentResponse,
                             servedVariantGroup1Comment1,
                             servedVariantGroup1UpdateComment1Response,
                             servedVariantGroup1UpdatedResponse,
                             servedVariantGroup1Revisions,
                             servedVariantGroup1RevisionsLast,
                             servedVariantGroup1SuggestedChanges,
                             servedVariantGroup1SuggestedChangeSubmitResponse,
                             servedVariantGroup1SuggestedChange7) {
    $httpBackend = $injector.get('$httpBackend');
    VariantGroups = $injector.get('VariantGroups');

    // setup mocked backend responses
    // core
    $httpBackend.when('GET', '/api/variant_groups/1').respond(200, servedVariantGroup1);
    $httpBackend.when('DELETE', '/api/variant_groups/1').respond(200, servedVariantGroup1);
    $httpBackend.when('POST', '/api/variant_groups').respond(201, 'Location: /api/variant_groups/500');
    $httpBackend.when('GET', '/api/variant_groups').respond(200, servedVariantGroups);
    $httpBackend.when('GET', '/api/variant_groups/1').respond(200, servedVariantGroup1UpdatedResponse);

    // comments
    $httpBackend.when('POST', '/api/variant_groups/1/comments').respond(201, servedVariantGroup1AddCommentResponse);
    $httpBackend.when('GET', '/api/variant_groups/1/comments').respond(200, servedVariantGroup1Comments);
    $httpBackend.when('GET', '/api/variant_groups/1/comments/1').respond(200, servedVariantGroup1Comment1);
    $httpBackend.when('PATCH', '/api/variant_groups/1/comments/1').respond(200, servedVariantGroup1UpdateComment1Response);
    $httpBackend.when('DELETE', '/api/variant_groups/1/comments/1').respond(204);

    // revisions
    $httpBackend.when('GET', '/api/variant_groups/1/revisions').respond(200, servedVariantGroup1Revisions);
    $httpBackend.when('GET', '/api/variant_groups/1/revisions/last').respond(200, servedVariantGroup1RevisionsLast);

    // suggested changes
    $httpBackend.when('POST', '/api/variant_groups/1/suggested_changes').respond(200, servedVariantGroup1SuggestedChangeSubmitResponse);
    $httpBackend.when('GET', '/api/variant_groups/1/suggested_changes').respond(200, servedVariantGroup1SuggestedChanges);
    $httpBackend.when('GET', '/api/variant_groups/1/suggested_changes/7').respond(200, servedVariantGroup1SuggestedChange7);
    $httpBackend.when('POST', '/api/variant_groups/1/suggested_changes/6/accept').respond(200);
    $httpBackend.when('POST', '/api/variant_groups/1/suggested_changes/7/reject').respond(200);

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('/api/variant_groups path', function() {
    it('VariantGroups.add({ [reqObj] }) should send a POST request to /api/variant_groups', function() {
      $httpBackend.expect('POST', '/api/variant_groups');
      VariantGroups.add({name: 'Variant Group 500', description: 'This is a very nice variant group with much to recommend it.'});
      $httpBackend.flush();
    });

    it('VariantGroups.get(1) should send a GET request to /api/variant_groups/1', function() {
      $httpBackend.expect('GET', '/api/variant_groups/1').respond(200, servedVariantGroup1);
      VariantGroups.get(1);
      $httpBackend.flush();
    });

    it('VariantGroups.delete(1) should send a DELETE request to /api/variants/1', function() {
      $httpBackend.expect('DELETE', '/api/variant_groups/1').respond(204);
      VariantGroups.delete(1);
      $httpBackend.flush();
    });

    it('VariantGroups.refresh(1) should send a GET request to /api/variant_groups/1 (and not hit the cache)', function() {
      VariantGroups.get(1);
      $httpBackend.expect('GET', '/api/variant_groups/1').respond(200, servedVariantGroup1);
      $httpBackend.flush();
      $httpBackend.expect('GET', '/api/variant_groups/1').respond(200, servedVariantGroup1);
      VariantGroups.refresh(1);
      $httpBackend.flush();
    });

    it('VariantGroups.query() should send a GET request to /api/variant_groups', function() {
      $httpBackend.expect('GET', '/api/variant_groups').respond(200, servedVariantGroups);
      VariantGroups.query();
      $httpBackend.flush();
    });

    it('VariantGroups.update({ [reqObj] }) should send a PATCH request to /api/variant_groups', function() {
      $httpBackend.expect('PATCH', '/api/variant_groups/1').respond(200, {});
      VariantGroups.update({ variantGroupId: 1, name: 'UPDATED NAME', description: 'UPDATED DESCRIPTION'});
      $httpBackend.flush();
    });
  });

  describe('/api/variants/:variantId/comments path', function() {
    it('VariantGroups.submitComment({ [reqObj] }) should send a POST request to /api/variant_groups/1/comments', function() {
      $httpBackend.expect('POST', '/api/variant_groups/1/comments', {
        variantGroupId: 1,
        title: 'comment title',
        text: 'comment text'
      });
      VariantGroups.submitComment({variantGroupId: 1, title: 'comment title', text: 'comment text'});
      $httpBackend.flush();
    });

    it('VariantGroups.updateComment( [reqObj] ) should send a PATCH request to /api/variant_groups/1/comments/1', function() {
      $httpBackend.expect(
        'PATCH',
        '/api/variant_groups/1/comments/1',
        {
          variantGroupId: 1,
          commentId: 1,
          title: 'updated comment title',
          text: 'updated comment text'
        });
      VariantGroups.updateComment({
        variantGroupId: 1,
        commentId: 1,
        title: 'updated comment title',
        text: 'updated comment text'
      });
      $httpBackend.flush();
    });

    it('VariantGroups.deleteComment( [reqObj] ) should send a DELETE request to /api/variant_groups/1/comments/1', function() {
      $httpBackend.expect('DELETE', '/api/variant_groups/1/comments/1');
      VariantGroups.deleteComment({ variantGroupId: 1, commentId: 1 });
      $httpBackend.flush();
    });

    it('VariantGroups.getComments(1) should send a GET request to /api/variant_groups/1/comments', function() {
      $httpBackend.expect('GET', '/api/variant_groups/1/comments');
      VariantGroups.getComments(1);
      $httpBackend.flush();
    });

    it('VariantGroups.getComment(1,1) should send a GET request to /api/variant_groups/1/comments/1', function() {
      $httpBackend.expect('GET', '/api/variant_groups/1/comments/1');
      VariantGroups.getComment(1,1);
      $httpBackend.flush();
    });
  });

  describe('/api/variants/:variantId/revisions path', function() {
    it('VariantGroups.getRevisions(1) should send a GET request to /api/variant_groups/1/revisions', function() {
      $httpBackend.expect('GET', '/api/variant_groups/1/revisions');
      VariantGroups.getRevisions(1);
      $httpBackend.flush();
    });

    it.skip('VariantGroups.getRevision({variantGroupId: 1, revisionId: 1}) should send a GET request to /api/variant_groups/1/revisions/1', function() {
      $httpBackend.expect('GET', '/api/variant_groups/1/revisions/1');
      VariantGroups.getRevision({variantGroupId: 1, revisionId: 1});
      $httpBackend.flush();
    });

    it('VariantGroups.getLastRevision(1) should send a GET request to /api/variant_groups/1/revisions/last', function() {
      $httpBackend.expect('GET', '/api/variant_groups/1/revisions/last');
      VariantGroups.getLastRevision(1);
      $httpBackend.flush();
    });
  });

  describe('/api/variant_groups/:variantGroupId/suggested_changes path', function() {
    it('VariantGroups.submitChange({ [reqObj] ) should send a POST request to /api/variant_groups/1/suggested_changes', function() {
      $httpBackend.expect('POST', '/api/variant_groups/1/suggested_changes');
      VariantGroups.submitChange({
        variantGroupId: 1,
        name: 'Imatinib Resistance Name, CHANGED',
        description: 'Imatinib Resistance Description, CHANGED'
      });
      $httpBackend.flush();
    });

    it('VariantGroups.getChanges(1) should send a GET request to /api/variant_groups/1/suggested_changes', function() {
      $httpBackend.expect('GET', '/api/variant_groups/1/suggested_changes');
      VariantGroups.getChanges(1);
      $httpBackend.flush();
    });

    it('VariantGroups.getChange(1,1) should send a GET request to /api/variant_groups/1/suggested_changes/7', function() {
      $httpBackend.expect('GET', '/api/variant_groups/1/suggested_changes/7');
      VariantGroups.getChange(1,7);
      $httpBackend.flush();
    });

    it('VariantGroups.acceptChange(1,6) should send a POST request to /api/variant_groups/1/suggested_changes/7/accept', function() {
      $httpBackend.expect('POST', '/api/variant_groups/1/suggested_changes/6/accept');
      VariantGroups.acceptChange(1,6);
      $httpBackend.flush();
    });

    it('VariantGroups.rejectChange(1,7) should send a POST request to /api/variant_groups/1/suggested_changes/6/reject', function() {
      $httpBackend.expect('POST', '/api/variant_groups/1/suggested_changes/7/reject');
      VariantGroups.rejectChange(1,7);
      $httpBackend.flush();
    });
  });

  //describe('/api/variants/:variantId/suggested_changes/:changeId/comments path', function() {
  //  it('VariantGroups.addChangeComment({variantGroupId: 1, changeId: 1, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/variant_groups/1/comments', function() {
  //    $httpBackend.expect(
  //      'POST',
  //      '/api/variant_groups/1/suggested_changes/1/comments',
  //      {
  //        variantGroupId: 1,
  //        changeId: 1,
  //        title: 'comment title',
  //        text: 'comment text'
  //      }).respond(200, {});
  //    VariantGroups.addChangeComment({
  //      variantGroupId: 1,
  //      changeId: 1,
  //      title: 'comment title',
  //      text: 'comment text'
  //    });
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.updateChangeComment({variantGroupId: 1, changeId: 1, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/variant_groups/1/suggested_changes/1/comments/1', function() {
  //    $httpBackend.expect(
  //      'PATCH',
  //      '/api/variant_groups/1/suggested_changes/1/comments/1',
  //      {
  //        variantGroupId: 1,
  //        changeId: 1,
  //        commentId: 1,
  //        title: 'updated comment title',
  //        text: 'updated comment text'
  //      }).respond(200, {});
  //    VariantGroups.updateChangeComment({
  //      variantGroupId: 1,
  //      changeId: 1,
  //      commentId: 1,
  //      title: 'updated comment title',
  //      text: 'updated comment text'
  //    });
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.deleteChangeComment({variantGroupId: 1, changeId: 1, commentId: 1}) should send a DELETE request to /api/variant_groups/1/suggested_changes/1/comments/1', function() {
  //    $httpBackend.expect('DELETE', '/api/variant_groups/1/suggested_changes/1/comments/1').respond(200, {});
  //    VariantGroups.deleteChangeComment({ variantGroupId: 1, changeId:1, commentId: 1 });
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getChangeComments({variantGroupId: 1, changeId: 1}) should send a GET request to /api/variant_groups/1/suggested_changes/1/comments', function() {
  //    $httpBackend.expect('GET', '/api/variant_groups/1/suggested_changes/1/comments').respond(200, []);
  //    VariantGroups.getChangeComments({variantGroupId: 1, changeId: 1});
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getChangeComment({variantGroupId: 1, changeId: 1, commentId: 1 }) should send a GET request to /api/variant_groups/1/suggested_changes/1/comments/1', function() {
  //    $httpBackend.expect('GET', '/api/variant_groups/1/suggested_changes/1/comments/1').respond(200, {});
  //    VariantGroups.getChangeComment({variantGroupId: 1, changeId: 1, commentId: 1});
  //    $httpBackend.flush();
  //  });
  //});
});
