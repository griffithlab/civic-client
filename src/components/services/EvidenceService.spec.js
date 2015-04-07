'use strict';
describe('EvidenceService', function() {
  var $httpBackend,
    servedEvidence,
    servedEvidence11,
    Evidence;

  beforeEach(module('civic.services'));
  beforeEach(module('served/evidence.json'));
  beforeEach(module('served/evidence11.json'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Evidence = $injector.get('Evidence');
    servedEvidence = $injector.get('servedEvidence');
    servedEvidence11 = $injector.get('servedEvidence11');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('/api/evidence_items path', function() {
    it('Evidence.add({pubmed_id: \'20979473\', text: \'Evidence description\'}) should send a POST request to /api/evidence_items', function() {
      $httpBackend.expect('POST', '/api/evidence_items', {pubmed_id: '20979473', text: 'Evidence description'}).respond('200', {});
      Evidence.add({pubmed_id: '20979473', text: 'Evidence description'});
      $httpBackend.flush();
    });

    it('Evidence.delete(11) should send a DELETE request to /api/evidence_items/11', function() {
      $httpBackend.expect('DELETE', '/api/evidence_items/11').respond('200', {});
      Evidence.delete(11);
      $httpBackend.flush();
    });

    it('Evidence.get(11) should send a GET request to /api/evidence_items/11', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11').respond('200', servedEvidence11);
      Evidence.get(11);
      $httpBackend.flush();
    });

    it('Evidence.query() should send a GET request to /api/evidence_items', function() {
      $httpBackend.expect('GET', '/api/evidence_items').respond('200', servedEvidence);
      Evidence.query();
      $httpBackend.flush();
    });

    it('Evidence.update({ evidenceId: 11, description: \'UPDATED DESCRIPTION\'}) should send a PUT request to /api/evidence_items', function() {
      $httpBackend.expect('PATCH', '/api/evidence_items/11').respond('200', {});
      Evidence.update({ evidenceId: 11, text: 'UPDATED TEXT'});
      $httpBackend.flush();
    });
  });

  describe('/api/evidence_items/:evidenceId/comments path', function() {
    it('Evidence.submitComment({evidenceId: 11, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/evidence_items/11/comments', function() {
      $httpBackend.expect(
        'POST',
        '/api/evidence_items/11/comments',
        {
          evidenceId: 11,
          title: 'comment title',
          text: 'comment text'
        }).respond('200', {});
      Evidence.submitComment({evidenceId: 11, title: 'comment title', text: 'comment text'});
      $httpBackend.flush();
    });

    it('Evidence.updateComment({evidenceId: 11, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/evidence_items/11/comments/1', function() {
      $httpBackend.expect(
        'PATCH',
        '/api/evidence_items/11/comments/1',
        {
          evidenceId: 11,
          commentId: 1,
          title: 'updated comment title',
          text: 'updated comment text'
        }).respond('200', {});
      Evidence.updateComment({
        evidenceId: 11,
        commentId: 1,
        title: 'updated comment title',
        text: 'updated comment text'
      });
      $httpBackend.flush();
    });

    it('Evidence.deleteComment({evidenceId: 11, commentId: 1}) should send a DELETE request to /api/evidence_items/11/comments/1', function() {
      $httpBackend.expect('DELETE', '/api/evidence_items/11/comments/1').respond('200', {});
      Evidence.deleteComment({ evidenceId: 11, commentId: 1 });
      $httpBackend.flush();
    });

    it('Evidence.getComments(11) should send a GET request to /api/evidence_items/11/comments', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/comments').respond('200', []);
      Evidence.getComments(11);
      $httpBackend.flush();
    });

    it('Evidence.getComment({evidenceId: 11, commentId: 1 }) should send a GET request to /api/evidence_items/11/comments/1', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/comments/1').respond('200', {});
      Evidence.getComment({evidenceId: 11, commentId: 1});
      $httpBackend.flush();
    });
  });

  describe('/api/evidence_items/:evidenceId/revisions path', function() {
    it('Evidence.getRevisions(11) should send a GET request to /api/evidence_items/11/revisions', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/revisions').respond('200', []);
      Evidence.getRevisions(11);
      $httpBackend.flush();
    });

    it('Evidence.getRevision({evidenceId: 11, revisionId: 1}) should send a GET request to /api/evidence_items/11/revisions/1', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/revisions/1').respond('200', {});
      Evidence.getRevision({evidenceId: 11, revisionId: 1});
      $httpBackend.flush();
    });

    it('Evidence.getLastRevision({evidenceId: 11}) should send a GET request to /api/evidence_items/11/revisions/last', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/revisions/last').respond('200', {});
      Evidence.getLastRevision({evidenceId: 11});
      $httpBackend.flush();
    });
  });

  describe('/api/evidence_items/:evidenceId/suggested_changes path', function() {
    it('Evidence.getSuggestedChanges(11) should send a GET request to /api/evidence_items/11/suggested_changes', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/suggested_changes').respond('200', []);
      Evidence.getChanges(11);
      $httpBackend.flush();
    });

    it('Evidence.getSuggestedChange({evidenceId: 11, changeId: 1}) should send a GET request to /api/evidence_items/11/suggested_changes/1', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/suggested_changes/1').respond('200', {});
      Evidence.getChange({evidenceId: 11, changeId: 1});
      $httpBackend.flush();
    });

    it('Evidence.acceptChange({evidenceId: 11, changeId: 1}) should send a POST request to /api/evidence_items/11/suggested_changes/1/accept', function() {
      $httpBackend.expect('POST', '/api/evidence_items/11/suggested_changes/1/accept').respond('200', {});
      Evidence.acceptChange({evidenceId: 11, changeId: 1});
      $httpBackend.flush();
    });

    it('Evidence.rejectChange({evidenceId: 11, changeId: 1}) should send a POST request to /api/evidence_items/11/suggested_changes/1/reject', function() {
      $httpBackend.expect('POST', '/api/evidence_items/11/suggested_changes/1/reject').respond('200', {});
      Evidence.rejectChange({evidenceId: 11, changeId: 1});
      $httpBackend.flush();
    });
  });

  describe('/api/evidence_items/:evidenceId/suggested_changes/:changeId/comments path', function() {
    it('Evidence.addChangeComment({evidenceId: 11, changeId: 1, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/evidence_items/11/comments', function() {
      $httpBackend.expect(
        'POST',
        '/api/evidence_items/11/suggested_changes/1/comments',
        {
          evidenceId: 11,
          changeId: 1,
          title: 'comment title',
          text: 'comment text'
        }).respond('200', {});
      Evidence.addChangeComment({
        evidenceId: 11,
        changeId: 1,
        title: 'comment title',
        text: 'comment text'
      });
      $httpBackend.flush();
    });

    it('Evidence.updateChangeComment({evidenceId: 11, changeId: 1, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/evidence_items/11/suggested_changes/1/comments/1', function() {
      $httpBackend.expect(
        'PATCH',
        '/api/evidence_items/11/suggested_changes/1/comments/1',
        {
          evidenceId: 11,
          changeId: 1,
          commentId: 1,
          title: 'updated comment title',
          text: 'updated comment text'
        }).respond('200', {});
      Evidence.updateChangeComment({
        evidenceId: 11,
        changeId: 1,
        commentId: 1,
        title: 'updated comment title',
        text: 'updated comment text'
      });
      $httpBackend.flush();
    });

    it('Evidence.deleteChangeComment({evidenceId: 11, changeId: 1, commentId: 1}) should send a DELETE request to /api/evidence_items/11/suggested_changes/1/comments/1', function() {
      $httpBackend.expect('DELETE', '/api/evidence_items/11/suggested_changes/1/comments/1').respond('200', {});
      Evidence.deleteChangeComment({ evidenceId: 11, changeId:1, commentId: 1 });
      $httpBackend.flush();
    });

    it('Evidence.getChangeComments({evidenceId: 11, changeId: 1}) should send a GET request to /api/evidence_items/11/suggested_changes/1/comments', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/suggested_changes/1/comments').respond('200', []);
      Evidence.getChangeComments({evidenceId: 11, changeId: 1});
      $httpBackend.flush();
    });

    it('Evidence.getChangeComment({evidenceId: 11, changeId: 1, commentId: 1 }) should send a GET request to /api/evidence_items/11/suggested_changes/1/comments/1', function() {
      $httpBackend.expect('GET', '/api/evidence_items/11/suggested_changes/1/comments/1').respond('200', {});
      Evidence.getChangeComment({evidenceId: 11, changeId: 1, commentId: 1});
      $httpBackend.flush();
    });
  });
});
