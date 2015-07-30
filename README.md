# seqit
## Sequential Iterator

Sometimes the JavaScript `forEach` loop is not dynamic enough, especially when you have to break out of the loop early, visit elements in a different order, or modify the object you are iterating over in-place. 

`seqit` is a general-purpose iterator module compatible with both Node.js and the browser, designed to provide a simple method of looping over an array or object using `for` or `while`, inspired by C++ iterators. You can wrap any array or object with the `seqit` function and iterate over its elements or keys. You can also edit the values you're iterating over in-place. `seqit` does not copy any data; it simply binds to an existing structure.

## Examples
```js
var seqit = require('seqit');
var array = [5, 4, 3, 5, 6, 7, 8, 9, 10];
for (var it = seqit(array); it !== it.end; it.next) {
  console.log(it());
}
```
Equivalently, in a while loop,
```js
var it = seqit(array)
while (it.hasNext) {
  console.log(it.next);
}
```
Looping over an object:
```js
var obj = { a: 5, b: 'woop' };
for (var it = seqit(obj); it !== it.end; it.next) {
  console.log(it().key + ': ' + it().value);
}
```
Editing an object in place:
```js
var obj = { a: 'woop', b: 'doop' }
for (var it = seqit(obj); it !== it.end; it.next) {
  it().key += 'a';
  it().value += 'a';
}
console.log(obj);
// { aa: 'woopa', ba: 'doopa' }
```
Editing an array in place:
```js
var array = [5, 4, 3, 5, 6, 7, 8, 9, 10];
for (var it = seqit(array); it !== it.end; it.next) {
  it(11);
}
console.log(array);
// [11, 11, 11, 11, 11, 11, 11, 11, 11]
```
Using the iteration index:
```js
var array = [5, 4, 3, 5, 6, 7, 8, 9, 10];
for (var it = seqit(array); it !== it.end; it.next) {
  console.log(it.index);
}
// 0, 1, 2, 3 ...
```
You can also set `it.index` if you want to manually change where you are in the loop.

More examples to come...

## Documentation

- `seqit(*val, config)`
  Function that returns an `Iterator` instance. If the first arguments are numbers, `seqit` will return an `Iterator` that iterates over a range of numbers. The first number is inclusive and the second is exclusive. You can also pass a single number to start from 0 implicitly, and you can pass a third number to indicate the step size. For example, `seqit(7)` will iterate over values 0 through 6, `seqit(1, 7)` will iterate over values 1 through 6, and `seqit(1, 7, 2)` will iterate over values 1, 3, and 5. If you pass an object to `seqit` it will return an iterator that iterates over the key value pairs of an object. If you pass an array to `seqit` the `Iterator` will iterate over each element. The last argument to `seqit` can be a configuration object, where you can pass `{ reversed: true, step: number }` to specify that you want to iterate in reverse order or set the step size.

- `Iterator(val)`
  If you call the iterator with no argument, it will return the current element being iterated over. If you pass a value in, it will set the current element to that value.

- `Iterator.size`
  Returns the amount of elements in the collection being iterated over.

- `Iterator.size = val`
  Manually set the size of collection being iterated over.

- `Iterator.end`
  A function that returns the last element in the collection, or the first if you are in reverse order. If you have reached the end of the iteration this function will be equal to the `Iterator` itself.

- `Iterator.end = val`
  Sets the last element of the array to `val`, or the first if you are in reverse order.

- `Iterator.begin`
  A function that returns the first element in the collection, or the last element if you are in reverse order. If you are at the beginning of the iteration this function will be equal to the `Iterator` itself.

- `Iterator.begin = val`
  Sets the first element of the array to `val`, or the last if you are in reverse order.

- `Iterator.reversed`
  Equal to `true` if you are in reverse order, false otherwise.

- `Iterator.reversed = true/false`
  Set the order of the iteration.

- `Iterator.step`
  Accessing this property will advance the iteration by one step.

- `Iterator.step = n`
  This will set the step size of the iteration to `n`.

- `Iterator.step(n)`
  This will advance the iteration by `n` step sizes.

- `Iterator.back`
  Accessing this property will advance the iteration by one step in the direction opposite to the iteration order.

- `Iterator.back(n)`
  This will advance the iteration by `n` step sizes in the direction opposite to the iteration order.

- `Iterator.index`
  Equal to the current index in the array being iterated over.

- `Iterator.index = val`
  Set the current index of the iteration.

- `Iterator.next`
  Acceessing this property returns the current element then advances the iteration forward by one step.

- `Iterator.prev`
  Accessing this property returns the current element then advances the iteration backward by one step.

- `Iterator.hasNext`
  Will be `true` if it is possible to call `Iterator.next`, `false` otherwise.

- `Iterator.hasPrev`
  Will be `true` if it is possible to call `Iterator.prev`, `false` otherwise.

- `Iterator.reset`
  Accessing this property will reset the iteration to the state it was in when the `Iterator` was constructed.

- `Iterator.find(function or value)`
  This will advance the iteration to the next element where the function you pass in returns `true`. If you are iterating over an array the function receives as its arguments: the current element, the current index, and the whole array, in that order. If you are iterating over an object the function is passed four arguments: the current value, the current key, the current index, and the whole object. If you pass `find` a value instead of a function, it will find the next element where the value is equal to the supplied value. If you pass an object as the value, `find` will iterate until it encounters an object that contains at least those keys and associated values. `find` will return `true` if it found a match, and `false` if it reached the end of the iteration without finding a match.

- `Iterator.select(function or value)`
  This function takes the same type of parameter as `find`, but it changes the behavior of the iteration so that it only visits matching elements. If you access `Iterator.reset` or call `Iterator.select()` with no argument it resets this behavior. `select` returns the iterator itself.

Examples of `select` and `find`:
```js
var it = seqit([5, 1, 4, 2, 3]);
while (it.find(function (v) { return v > 3; })) {
  console.log(it());
}
// console: '5' '4'
```
or equivalently:
```
for (var it = seqit([5, 1, 4, 2, 3]).select(function (v) { return v > 3; }); it !== it.end; it.next) {
  console.log(it());
}
```

## License
MIT
