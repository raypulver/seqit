var seqit = require('..'),
    expect = require('chai').expect;
describe('seqit - the sequential iterator', function () {
  it('can be used as a for loop', function () {
    var fill = [];
    var sample = [5, 4, 2, 1];
    for (var it = seqit(sample); it !== it.end; it.next) {
      fill.push(it());
    }
    expect(fill).to.eql(sample);
  });
  it('can be used in a while loop', function () {
    var fill = [];
    var sample = [5, 4, 3, 1];
    var it = seqit(sample);
    while (it.hasNext) {
      fill.push(it.next);
    }
    expect(fill).to.eql(sample);
  });
  it('can be used in reverse order', function () {
    var fill = [];
    var sample = [5, 4, 3, 1];
    var it = seqit(sample, { reversed: true });
    while (it.hasNext) {
      fill.push(it.next);
    }
    sample.reverse();
    expect(fill).to.eql(sample);
  });
  it('can iterate over an object', function () {
    var obj = { a: 55, b: 66 };
    var fill = {};
    for (var it = seqit(obj); it !== it.end; it.step) {
      fill[it().key] = it().value;
    }
    expect(fill).to.eql(obj);
  });
  it('can iterate over a range', function () {
    var fill = [];
    var expected = [2, 4, 6, 8];
    for (var it = seqit(2, 10, 2); it !== it.end; it.step) {
      fill.push(it());
    }
    expect(fill).to.eql(expected);
  });
  it('can find elements', function () {
    var fill = [];
    var arr = [5, 1, 6, 2, 7];
    var it = seqit(arr);
    while (it.find(function (v) { return v > 4; })) {
      fill.push(it());
    }
    expect(fill).to.eql([5, 6, 7]);
  });
  it('can search for an object', function () {
    var arr = [{a: 6, b: 'woop'}, {a: 5, b: 'doop'}];
    var fill = [];
    for (var it = seqit(arr).select({ b: 'woop' }); it !== it.end; it.next) {
      fill.push(it().b);
    }
    expect(fill).to.eql(['woop']);
  });
  it('can be reset in reversed order', function () {
    var arr = [5, 3, 1];
    var fill = [];
    for (var it = seqit(arr, { reversed: true }); it !== it.end; it.next) {
      fill.push(it());
    }
    it.reset;
    for (; it !== it.end; it.next) {
      fill.push(it());
    }
    arr.reverse();
    expect(fill).to.eql(arr.concat(arr));
  });
});
