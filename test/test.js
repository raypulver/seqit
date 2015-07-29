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
});
