'use strict';
describe('VariantGroupsService', function() {
  var $httpBackend,
    servedVariantGroup1,
    servedVariantGroups,
    VariantGroups;

  beforeEach(module('civic.services'));
  beforeEach(module('served/variantGroups.json'));
  beforeEach(module('served/variantGroup1.json'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    VariantGroups = $injector.get('VariantGroups');
    servedVariantGroup1 = $injector.get('servedVariantGroup1');
    servedVariantGroups = $injector.get('servedVariantGroups');

    // setup mocked backend responses
    $httpBackend.when('GET', '/api/variant_groups/1').respond(200, servedVariantGroup1);
    $httpBackend.when('DELETE', '/api/variant_groups/1').respond(200, servedVariantGroup1);
    $httpBackend.when('POST', '/api/variant_groups').respond(201, 'Location: /api/variant_groups/500');
    $httpBackend.when('GET', '/api/variant_groups').respond(200, servedVariantGroups);

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

    it('VariantGroups.delete(7) should send a DELETE request to /api/variants/1', function() {
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

  //describe('/api/variants/:variantId/evidence_items path', function() {
  //  it('VariantGroups.getEvidenceItems(7) should send a GET request to /api/variants/7/evidence_items', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/evidence_items').respond(200, servedVariant7EvidenceItems);
  //    VariantGroups.getEvidenceItems(7);
  //    $httpBackend.flush();
  //  });
  //});
  //
  //describe('/api/variants/:variantId/variant_groups path', function() {
  //  it('VariantGroups.getVariantGroups(7) should send a GET request to /api/variants/7/variant_groups', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/variant_groups').respond(200, servedVariant7VariantGroups);
  //    VariantGroups.getVariantGroups(7);
  //    $httpBackend.flush();
  //  });
  //});
  //
  //describe('/api/variants/:variantId/comments path', function() {
  //  it('VariantGroups.submitComment({variantId: 7, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/variants/7/comments', function() {
  //    $httpBackend.expect(
  //      'POST',
  //      '/api/variants/7/comments',
  //      {
  //        variantId: 7,
  //        title: 'comment title',
  //        text: 'comment text'
  //      }).respond(200, {});
  //    VariantGroups.submitComment({variantId: 7, title: 'comment title', text: 'comment text'});
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.updateComment({variantId: 7, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/variants/7/comments/1', function() {
  //    $httpBackend.expect(
  //      'PATCH',
  //      '/api/variants/7/comments/1',
  //      {
  //        variantId: 7,
  //        commentId: 1,
  //        title: 'updated comment title',
  //        text: 'updated comment text'
  //      }).respond(200, {});
  //    VariantGroups.updateComment({
  //      variantId: 7,
  //      commentId: 1,
  //      title: 'updated comment title',
  //      text: 'updated comment text'
  //    });
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.deleteComment({variantId: 7, commentId: 1}) should send a DELETE request to /api/variants/7/comments/1', function() {
  //    $httpBackend.expect('DELETE', '/api/variants/7/comments/1').respond(200, {});
  //    VariantGroups.deleteComment({ variantId: 7, commentId: 1 });
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getComments(7) should send a GET request to /api/variants/7/comments', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/comments').respond(200, []);
  //    VariantGroups.getComments(7);
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getComment({variantId: 7, commentId: 1 }) should send a GET request to /api/variants/7/comments/1', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/comments/1').respond(200, {});
  //    VariantGroups.getComment({variantId: 7, commentId: 1});
  //    $httpBackend.flush();
  //  });
  //});
  //
  //describe('/api/variants/:variantId/revisions path', function() {
  //  it('VariantGroups.getRevisions(7) should send a GET request to /api/variants/7/revisions', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/revisions').respond(200, []);
  //    VariantGroups.getRevisions(7);
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getRevision({variantId: 7, revisionId: 1}) should send a GET request to /api/variants/7/revisions/1', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/revisions/1').respond(200, {});
  //    VariantGroups.getRevision({variantId: 7, revisionId: 1});
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getLastRevision({variantId: 7}) should send a GET request to /api/variants/7/revisions/last', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/revisions/last').respond(200, {});
  //    VariantGroups.getLastRevision({variantId: 7});
  //    $httpBackend.flush();
  //  });
  //});
  //
  //describe('/api/variants/:variantId/suggested_changes path', function() {
  //  it('VariantGroups.getSuggestedChanges(7) should send a GET request to /api/variants/7/suggested_changes', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/suggested_changes').respond(200, []);
  //    VariantGroups.getChanges(7);
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getSuggestedChange({variantId: 7, changeId: 1}) should send a GET request to /api/variants/7/suggested_changes/1', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/suggested_changes/1').respond(200, {});
  //    VariantGroups.getChange({variantId: 7, changeId: 1});
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.acceptChange({variantId: 7, changeId: 1}) should send a POST request to /api/variants/7/suggested_changes/1/accept', function() {
  //    $httpBackend.expect('POST', '/api/variants/7/suggested_changes/1/accept').respond(200, {});
  //    VariantGroups.acceptChange({variantId: 7, changeId: 1});
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.rejectChange({variantId: 7, changeId: 1}) should send a POST request to /api/variants/7/suggested_changes/1/reject', function() {
  //    $httpBackend.expect('POST', '/api/variants/7/suggested_changes/1/reject').respond(200, {});
  //    VariantGroups.rejectChange({variantId: 7, changeId: 1});
  //    $httpBackend.flush();
  //  });
  //});
  //
  //describe('/api/variants/:variantId/suggested_changes/:changeId/comments path', function() {
  //  it('VariantGroups.addChangeComment({variantId: 7, changeId: 1, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/variants/7/comments', function() {
  //    $httpBackend.expect(
  //      'POST',
  //      '/api/variants/7/suggested_changes/1/comments',
  //      {
  //        variantId: 7,
  //        changeId: 1,
  //        title: 'comment title',
  //        text: 'comment text'
  //      }).respond(200, {});
  //    VariantGroups.addChangeComment({
  //      variantId: 7,
  //      changeId: 1,
  //      title: 'comment title',
  //      text: 'comment text'
  //    });
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.updateChangeComment({variantId: 7, changeId: 1, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/variants/7/suggested_changes/1/comments/1', function() {
  //    $httpBackend.expect(
  //      'PATCH',
  //      '/api/variants/7/suggested_changes/1/comments/1',
  //      {
  //        variantId: 7,
  //        changeId: 1,
  //        commentId: 1,
  //        title: 'updated comment title',
  //        text: 'updated comment text'
  //      }).respond(200, {});
  //    VariantGroups.updateChangeComment({
  //      variantId: 7,
  //      changeId: 1,
  //      commentId: 1,
  //      title: 'updated comment title',
  //      text: 'updated comment text'
  //    });
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.deleteChangeComment({variantId: 7, changeId: 1, commentId: 1}) should send a DELETE request to /api/variants/7/suggested_changes/1/comments/1', function() {
  //    $httpBackend.expect('DELETE', '/api/variants/7/suggested_changes/1/comments/1').respond(200, {});
  //    VariantGroups.deleteChangeComment({ variantId: 7, changeId:1, commentId: 1 });
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getChangeComments({variantId: 7, changeId: 1}) should send a GET request to /api/variants/7/suggested_changes/1/comments', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/suggested_changes/1/comments').respond(200, []);
  //    VariantGroups.getChangeComments({variantId: 7, changeId: 1});
  //    $httpBackend.flush();
  //  });
  //
  //  it('VariantGroups.getChangeComment({variantId: 7, changeId: 1, commentId: 1 }) should send a GET request to /api/variants/7/suggested_changes/1/comments/1', function() {
  //    $httpBackend.expect('GET', '/api/variants/7/suggested_changes/1/comments/1').respond(200, {});
  //    VariantGroups.getChangeComment({variantId: 7, changeId: 1, commentId: 1});
  //    $httpBackend.flush();
  //  });
  //});
});
