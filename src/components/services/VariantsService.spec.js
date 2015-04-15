'use strict';
describe('VariantsService', function() {
  var $httpBackend,
    servedVariant7,
    servedVariants,
    servedVariant7VariantGroups,
    servedVariant7EvidenceItems,
    Variants;

  beforeEach(module('civic.services'));
  beforeEach(module('served/variants.json'));
  beforeEach(module('served/variant7.json'));
  beforeEach(module('served/variant7VariantGroups.json'));
  beforeEach(module('served/variant7EvidenceItems.json'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Variants = $injector.get('Variants');
    servedVariant7 = $injector.get('servedVariant7');
    servedVariants = $injector.get('servedVariants');
    servedVariant7VariantGroups = $injector.get('servedVariant7VariantGroups');
    servedVariant7EvidenceItems = $injector.get('servedVariant7EvidenceItems');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('/api/variants path', function() {
    it('Variants.add({entrez_name: \'GENE\', description: \'GENE description\'}) should send a POST request to /api/variants', function() {
      $httpBackend.expect('POST', '/api/variants', {entrez_name: 'GENE', description: 'GENE description'}).respond('200', {});
      Variants.add({entrez_name: 'GENE', description: 'GENE description'});
      $httpBackend.flush();
    });

    it('Variants.delete(7) should send a DELETE request to /api/variants/7', function() {
      $httpBackend.expect('DELETE', '/api/variants/7').respond('200', {});
      Variants.delete(7);
      $httpBackend.flush();
    });

    it('Variants.get(7) should send a GET request to /api/variants/7', function() {
      $httpBackend.expect('GET', '/api/variants/7').respond('200', servedVariant7);
      Variants.get(7);
      $httpBackend.flush();
    });

    it('Variants.refresh(7) should send a GET request to /api/variants/7 (and not hit the variant cache)', function() {
      Variants.get(7);
      $httpBackend.expect('GET', '/api/variants/7').respond('200', servedVariant7);
      $httpBackend.flush();
      $httpBackend.expect('GET', '/api/variants/7').respond('200', servedVariant7);
      Variants.refresh(7);
      $httpBackend.flush();
    });

    it('Variants.query() should send a GET request to /api/variants', function() {
      $httpBackend.expect('GET', '/api/variants').respond('200', servedVariants);
      Variants.query();
      $httpBackend.flush();
    });

    it('Variants.update({ variantId: 7, description: \'UPDATED DESCRIPTION\'}) should send a PUT request to /api/variants', function() {
      $httpBackend.expect('PATCH', '/api/variants').respond('200', {});
      Variants.update({ variantId: 7, description: 'UPDATED DESCRIPTION'});
      $httpBackend.flush();
    });
  });

  describe('/api/variants/:variantId/evidence_items path', function() {
    it('Variants.getEvidenceItems(7) should send a GET request to /api/variants/7/evidence_items', function() {
      $httpBackend.expect('GET', '/api/variants/7/evidence_items').respond(200, servedVariant7EvidenceItems);
      Variants.getEvidenceItems(7);
      $httpBackend.flush();
    });
  });

  describe('/api/variants/:variantId/variant_groups path', function() {
    it('Variants.getVariantGroups(7) should send a GET request to /api/variants/7/variant_groups', function() {
      $httpBackend.expect('GET', '/api/variants/7/variant_groups').respond('200', servedVariant7VariantGroups);
      Variants.getVariantGroups(7);
      $httpBackend.flush();
    });
  });

  describe('/api/variants/:variantId/comments path', function() {
    it('Variants.submitComment({variantId: 7, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/variants/7/comments', function() {
      $httpBackend.expect(
        'POST',
        '/api/variants/7/comments',
        {
          variantId: 7,
          title: 'comment title',
          text: 'comment text'
        }).respond('200', {});
      Variants.submitComment({variantId: 7, title: 'comment title', text: 'comment text'});
      $httpBackend.flush();
    });

    it('Variants.updateComment({variantId: 7, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/variants/7/comments/1', function() {
      $httpBackend.expect(
        'PATCH',
        '/api/variants/7/comments/1',
        {
          variantId: 7,
          commentId: 1,
          title: 'updated comment title',
          text: 'updated comment text'
        }).respond('200', {});
      Variants.updateComment({
        variantId: 7,
        commentId: 1,
        title: 'updated comment title',
        text: 'updated comment text'
      });
      $httpBackend.flush();
    });

    it('Variants.deleteComment({variantId: 7, commentId: 1}) should send a DELETE request to /api/variants/7/comments/1', function() {
      $httpBackend.expect('DELETE', '/api/variants/7/comments/1').respond('200', {});
      Variants.deleteComment({ variantId: 7, commentId: 1 });
      $httpBackend.flush();
    });

    it('Variants.getComments(7) should send a GET request to /api/variants/7/comments', function() {
      $httpBackend.expect('GET', '/api/variants/7/comments').respond('200', []);
      Variants.getComments(7);
      $httpBackend.flush();
    });

    it('Variants.getComment({variantId: 7, commentId: 1 }) should send a GET request to /api/variants/7/comments/1', function() {
      $httpBackend.expect('GET', '/api/variants/7/comments/1').respond('200', {});
      Variants.getComment({variantId: 7, commentId: 1});
      $httpBackend.flush();
    });
  });

  describe('/api/variants/:variantId/revisions path', function() {
    it('Variants.getRevisions(7) should send a GET request to /api/variants/7/revisions', function() {
      $httpBackend.expect('GET', '/api/variants/7/revisions').respond('200', []);
      Variants.getRevisions(7);
      $httpBackend.flush();
    });

    it('Variants.getRevision({variantId: 7, revisionId: 1}) should send a GET request to /api/variants/7/revisions/1', function() {
      $httpBackend.expect('GET', '/api/variants/7/revisions/1').respond('200', {});
      Variants.getRevision({variantId: 7, revisionId: 1});
      $httpBackend.flush();
    });

    it('Variants.getLastRevision({variantId: 7}) should send a GET request to /api/variants/7/revisions/last', function() {
      $httpBackend.expect('GET', '/api/variants/7/revisions/last').respond('200', {});
      Variants.getLastRevision({variantId: 7});
      $httpBackend.flush();
    });
  });

  describe('/api/variants/:variantId/suggested_changes path', function() {
    it('Variants.getSuggestedChanges(7) should send a GET request to /api/variants/7/suggested_changes', function() {
      $httpBackend.expect('GET', '/api/variants/7/suggested_changes').respond('200', []);
      Variants.getChanges(7);
      $httpBackend.flush();
    });

    it('Variants.getSuggestedChange({variantId: 7, changeId: 1}) should send a GET request to /api/variants/7/suggested_changes/1', function() {
      $httpBackend.expect('GET', '/api/variants/7/suggested_changes/1').respond('200', {});
      Variants.getChange({variantId: 7, changeId: 1});
      $httpBackend.flush();
    });

    it('Variants.acceptChange({variantId: 7, changeId: 1}) should send a POST request to /api/variants/7/suggested_changes/1/accept', function() {
      $httpBackend.expect('POST', '/api/variants/7/suggested_changes/1/accept').respond('200', {});
      Variants.acceptChange({variantId: 7, changeId: 1});
      $httpBackend.flush();
    });

    it('Variants.rejectChange({variantId: 7, changeId: 1}) should send a POST request to /api/variants/7/suggested_changes/1/reject', function() {
      $httpBackend.expect('POST', '/api/variants/7/suggested_changes/1/reject').respond('200', {});
      Variants.rejectChange({variantId: 7, changeId: 1});
      $httpBackend.flush();
    });
  });

  describe('/api/variants/:variantId/suggested_changes/:changeId/comments path', function() {
    it('Variants.addChangeComment({variantId: 7, changeId: 1, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/variants/7/comments', function() {
      $httpBackend.expect(
        'POST',
        '/api/variants/7/suggested_changes/1/comments',
        {
          variantId: 7,
          changeId: 1,
          title: 'comment title',
          text: 'comment text'
        }).respond('200', {});
      Variants.addChangeComment({
        variantId: 7,
        changeId: 1,
        title: 'comment title',
        text: 'comment text'
      });
      $httpBackend.flush();
    });

    it('Variants.updateChangeComment({variantId: 7, changeId: 1, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/variants/7/suggested_changes/1/comments/1', function() {
      $httpBackend.expect(
        'PATCH',
        '/api/variants/7/suggested_changes/1/comments/1',
        {
          variantId: 7,
          changeId: 1,
          commentId: 1,
          title: 'updated comment title',
          text: 'updated comment text'
        }).respond('200', {});
      Variants.updateChangeComment({
        variantId: 7,
        changeId: 1,
        commentId: 1,
        title: 'updated comment title',
        text: 'updated comment text'
      });
      $httpBackend.flush();
    });

    it('Variants.deleteChangeComment({variantId: 7, changeId: 1, commentId: 1}) should send a DELETE request to /api/variants/7/suggested_changes/1/comments/1', function() {
      $httpBackend.expect('DELETE', '/api/variants/7/suggested_changes/1/comments/1').respond('200', {});
      Variants.deleteChangeComment({ variantId: 7, changeId:1, commentId: 1 });
      $httpBackend.flush();
    });

    it('Variants.getChangeComments({variantId: 7, changeId: 1}) should send a GET request to /api/variants/7/suggested_changes/1/comments', function() {
      $httpBackend.expect('GET', '/api/variants/7/suggested_changes/1/comments').respond('200', []);
      Variants.getChangeComments({variantId: 7, changeId: 1});
      $httpBackend.flush();
    });

    it('Variants.getChangeComment({variantId: 7, changeId: 1, commentId: 1 }) should send a GET request to /api/variants/7/suggested_changes/1/comments/1', function() {
      $httpBackend.expect('GET', '/api/variants/7/suggested_changes/1/comments/1').respond('200', {});
      Variants.getChangeComment({variantId: 7, changeId: 1, commentId: 1});
      $httpBackend.flush();
    });
  });
});
