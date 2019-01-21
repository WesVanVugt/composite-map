# composite-map

A module for mapping between multi-part keys and values.

## Install

```
npm install composite-map
```

## Usage

```js
const { CompositeMap } = require("composite-map");
const map = new CompositeMap();
map.set(["one", 2, true], "test-value");
map.get(["one", 2, true]);
//=> 'test-value'
```

## API

### new CompositeMap([entries, [options]])

#### entries

Type: `CompositeMap` `Array`

Elements to populate the map with. `Array` inputs must be in the same form as those created by the
[CompositeMap.prototype.toJSON\(\)](#CompositeMap.prototype.toJSON) method.

```js
const map1 = new CompositeMap();
const map2 = new CompositeMap(map1);
const map3 = new CompositeMap([["one", "test-value"], ["two", "test-value-2"]], { keyLength: 1 });
const map4 = new CompositeMap([["one", [[2, "test-value"]]]], { keyLength: 2 });
const map5 = new CompositeMap([["one", [[2, [[true, "test-value"]]]]]], { keyLength: 3 });
```

#### options

Type: `Object`

##### copy

Type: `"reference"` `"on-write"` `"keys"`
Default: `"keys"`

Determines when the keys for the provided `CompositeMap` are copied.

###### `"reference"`

Never copy keys. Changes made will affect the source.

###### `"on-write"`

Copy keys as changes are made.

###### `"keys"`

Copy all keys immediately.

##### keyLength

Type: `number`

Manually specify the length of keys. Only used when constructing using an array of elements.

### CompositeMap.prototype.clear()

Removes all key/value pairs from the `CompositeMap` object.

### CompositeMap.prototype.delete(key)

Returns `true` if an element in the `CompositeMap` object existed and has been removed, or `false` if the element does
not exist.

#### key

Type: `Array`

The key of the element to be deleted. Shorter keys will delete all elements with matching keys.

### CompositeMap.prototype.entries()

Returns a new `Iterator` object that contains an array of `[key, value]` for each element in the `CompositeMap` object.

### CompositeMap.prototype.forEach(callbackFn)

Calls callbackFn once for each key-value pair present in the `CompositeMap` object.

### CompositeMap.prototype.get(key)

Returns the value associated to the `key`, or `undefined` if there is none.

#### key

Type: `Array`

The `key` of the element to be returned. Shorter keys will return the `Map` object associated to the key if one exists.

### CompositeMap.prototype.has(key)

Returns a boolean asserting whether a value has been associated to the `key` in the `CompositeMap` object or not.

#### key

Type: `Array`

The `key` of the element to be found. Shorter keys will find any elements with matching keys.

### CompositeMap.prototype.keys()

Returns a new `Iterator` object that contains the keys for each element in the `CompositeMap` object.

### CompositeMap.prototype.set(key, value)

Sets the value of the `key` in the `CompositeMap` object. Returns the `CompositeMap` object.

#### key

Type: `Array`

The `key` to set the value for. All keys must have the same `Array` length.

#### value

Type: `any`

The value to store.

### CompositeMap.prototype.toJSON()

Returns a tree-like `Array` structure containing all elements in the `CompositeMap` object.

```js
const map = new CompositeMap();
map.set(["one", 2, true], "test-value");
const json = JSON.stringify(map);
console.log(json);
//=>[["one", [[2, [[true, "test-value"]]]]]]
const map2 = new CompositeMap(JSON.parse(json), { keyLength: 3 });
```

### CompositeMap.prototype.values()

Returns a new `Iterator` object that contains the values for each element in the `CompositeMap` object.

### CompositeMap.prototype\[@@iterator\]()

Returns a new `Iterator` object that contains an array of `[key, value]` for each element in the `CompositeMap` object.

## TypeScript

To provide better typing support, you can import copies of the `CompositeMap` class typed for the length of `key` being
used.

```ts
import { CompositeMap3 } from "composite-map";
const map = new CompositeMap3<string, number, boolean>();
map.set(["one", 2, true], "test-value");
const value: string = map.get(["one", 2, true]);
const subMap: Map<boolean, string> = map.get(["one", 2]);
```

## License

[MIT](https://github.com/WesVanVugt/composite-map/blob/master/license)

## Sources

Some text from this readme was sourced from [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
