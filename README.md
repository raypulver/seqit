# seqit - Sequential Iterator

Sometimes the JavaScript `forEach` loop is not dynamic enough, especially when you have to break out of the loop early, visit elements in a different order, or modify the object you are iterating over in-place. And functions like `map` or `reduce` and many of the functions provided by a library like lo-dash can be easily accomplished using a traditional loop without extra abstraction. This is where `seqit` comes in.

`seqit` is a general-purpose iterator module incompatible with both Node.js and the browser, designed to provide a simple method of looping over an array or object using `for` or `while`, inspired by C++ iterators. You can wrap any array or object with the `seqit` function and iterate over its elements or keys. You can also edit the values you're iterating over in-place. `seqit` does not copy any data; it simply binds to an existing structure.

## Usage
```
var seqit = require('seqit');
var array = [5, 4, 3, 5, 6, 7, 8, 9, 10];
for (var it = seqit(array); it !== it.end; it.next) {
  console.log(it());
}
```
Equivalently, in a while loop,
```
var it = seqit(array)
while (it.hasNext) {
  console.log(it.next);
}
```
Looping over an object:
```
var obj = { a: 5, b: 'woop' };
for (var it = seqit(obj); it !== it.end; it.next) {
  console.log(it().key + ': ' + it().value);
}
```
Editing an object in place:
```
var obj = { a: 'woop', b: 'doop' }
for (var it = seqit(obj); it !== it.end; it.next) {
  it().key = it().key + 'a';
  it().value = it().value + 'a';
}
console.log(obj);
// { aa: 'woopa', ba: 'doopa' }
```
Editing an array in place:
```
var array = [5, 4, 3, 5, 6, 7, 8, 9, 10];
for (var it = seqit(array); it !== it.end; it.next) {
  it(11);
}
console.log(array);
// [11, 11, 11, 11, 11, 11, 11, 11, 11]
```
Using the iteration index:
```
var array = [5, 4, 3, 5, 6, 7, 8, 9, 10];
for (var it = seqit(array); it !== it.end; it.next) {
  console.log(it.index);
}
// 0, 1, 2, 3 ...
```
You can also set `it.index` if you want to manually change where you are in the loop.
Using `it.begin`
```
for (var it = seqit(array); it !== it.end; it.next) {
  if (it.begin === it) {
    console.log('iterating over the first element of the array');
  }
}
```
More examples to come...
