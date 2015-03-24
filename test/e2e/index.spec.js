'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;

describe('no protractor at all', function() {
  it('should still do normal tests', function() {
    expect(true).to.equal(true);
  });
});

describe('protractor library', function() {
  it.skip('should be able to skip tests', function() {
    expect(true).to.equal(false);
  });

  it('should expose the correct global variables', function() {
    expect(protractor).to.exist;
    expect(browser).to.exist;
    expect(by).to.exist;
    expect(element).to.exist;
    expect($).to.exist;
  });

  it('should wrap webdriver', function() {
    // Mocha will report the spec as slow if it goes over this time in ms.
    this.slow(6000);
    browser.get('http://127.0.0.1:3001/');
    expect(browser.getTitle()).to.eventually.contain('CIViC');
  });
});

//describe('The main view', function () {
//
//  beforeEach(function () {
//    browser.get('http://127.0.0.1:3001');
//  });
//
//  describe('Angular app in <html>', function() {
//    // var ptor = protractor.getInstance();
//    browser.get('http://127.0.0.1:3001/#/home');
//  });
//
//});
