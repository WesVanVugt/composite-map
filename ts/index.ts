export interface RecursiveMap<K, V> extends Map<K, RecursiveMap<K, V> | V> {}

export interface RecursiveEntries<K, V> extends Array<[K, RecursiveEntries<K, V> | V]> {}

export type CompositeMapCopyMethod = "reference" | "on-write" | "keys";

export interface CompositeMapOptions {
    /**
     * Indicates when CompositeMap key data passed to the constructor is copied.
     * * "reference": Never copy key data, referencing the original data instead. The most performant option.
     * * "on-write": Copy the data as necessary when changes are made. Incurs a performance pentalty, but preserves
     * the original data.
     * * "keys": Copy the key data. More performant than "on-write" when there are few entries, but less performant
     * when there are many. This is the default option.
     */
    copy?: CompositeMapCopyMethod;
    /**
     * Indicates the length of the key for this map. Only used when constructing using RecursiveEntries since the
     * key-length cannot be inferred.
     */
    keyLength?: number;
}

// TODO: Reduce casting
export class CompositeMap<K, V> {
    private data: RecursiveMap<K, V>;
    private keyLength: number;
    private copiedSet?: Set<RecursiveMap<K, V>>;

    constructor();
    constructor(entries: CompositeMap<K, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries<K, V>, options: CompositeMapOptions & { keyLength: number });
    constructor(entries?: CompositeMap<K, V> | RecursiveEntries<K, V>, options?: CompositeMapOptions) {
        if (!entries) {
            this.copiedSet = undefined;
            this.keyLength = 0;
            this.data = new Map();
        } else if (entries instanceof CompositeMap) {
            const copyMethod: CompositeMapCopyMethod = (options && options.copy) || "keys";
            switch (copyMethod) {
                case "keys":
                    this.copiedSet = undefined;
                    this.keyLength = entries.keyLength;
                    this.data = copyMaps(entries.data, entries.keyLength, 0);
                    break;
                case "on-write":
                    // When using copy-on-write, map being copied must also use copy-on-write mode
                    if (entries.copiedSet) {
                        entries.copiedSet.clear();
                    } else {
                        entries.copiedSet = new Set();
                    }
                    this.copiedSet = new Set();
                case "reference":
                    this.keyLength = entries.keyLength;
                    this.data = entries.data;
                    break;
                default:
                    throw new Error(`Unrecognized copy method '${copyMethod}'`);
            }
        } else {
            this.keyLength = (options && options.keyLength) || 0;
            if (!this.keyLength) {
                throw new Error("Array inputs require a non-zero value for options.keyLength");
            }
            this.data = recursiveEntriesToRecursiveMap(this.keyLength - 1, entries, 0);
        }
    }

    public set(key: K[], value: V): this {
        if (key.length !== this.keyLength) {
            if (!this.keyLength) {
                this.keyLength = key.length;
            } else {
                throw Error("Invalid key length");
            }
        }
        let map = this.data;
        if (this.copiedSet && !this.copiedSet.has(map)) {
            const temp = map;
            map = new Map();
            temp.forEach((v, k) => {
                map.set(k, v);
            });
            this.data = map;
            this.copiedSet.add(map);
        }
        const lastPartIndex = key.length - 1;
        for (let i = 0; i < lastPartIndex; i++) {
            const keyPart = key[i];
            let nextMap = map.get(keyPart) as RecursiveMap<K, V> | undefined;
            if (!nextMap) {
                nextMap = new Map();
                map.set(keyPart, nextMap);
                if (this.copiedSet) {
                    this.copiedSet.add(nextMap);
                }
            } else if (this.copiedSet && !this.copiedSet.has(nextMap)) {
                nextMap = copyMap(nextMap);
                this.copiedSet.add(nextMap);
                map.set(keyPart, nextMap);
            }
            map = nextMap;
        }
        (map as Map<K, V>).set(key[lastPartIndex], value);
        return this;
    }

    public clear(): void {
        this.data.clear();
        this.keyLength = 0;
    }

    public delete(key: K[]): boolean {
        if (!this.keyLength) {
            return false;
        }
        if (!key.length) {
            if (!this.data.size) {
                return false;
            }
            this.clear();
            return true;
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let map: RecursiveMap<K, V> | undefined = this.data;
        const maps: Array<RecursiveMap<K, V>> = [map];
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            map = (map as RecursiveMap<K, V>).get(key[i]) as RecursiveMap<K, V> | undefined;
            if (!map) {
                return false;
            }
            maps[i + 1] = map;
        }
        if (!(map as RecursiveMap<K, V>).has(key[lastKeyPos])) {
            return false;
        }
        // Prune the tree
        let deletePoint: number = lastKeyPos;
        for (; deletePoint > 0; deletePoint--) {
            const map2: RecursiveMap<K, V> = maps[deletePoint];
            if (map2.size > 1) {
                // Every map has been checked that the corresponding key is present, so if there is only one
                // element, it must belong to the key we are removing.
                break;
            }
            if (this.copiedSet) {
                this.copiedSet.delete(map2);
            }
        }
        return this.copySection(maps, key, deletePoint).delete(key[deletePoint]);
    }

    public has(key: K[]): boolean {
        if (!this.keyLength) {
            return false;
        }
        if (!key.length) {
            return this.data.size > 0;
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let map: RecursiveMap<K, V> | undefined = this.data;
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            map = (map as RecursiveMap<K, V>).get(key[i]) as RecursiveMap<K, V>;
            if (!map) {
                return false;
            }
        }
        return (map as RecursiveMap<K, V>).has(key[lastKeyPos]);
    }

    public get(key: K[]): V | RecursiveMap<K, V> | undefined {
        if (!key.length) {
            return this.data;
        }
        if (!this.keyLength || !key.length) {
            return undefined;
        }
        if (key.length > this.keyLength) {
            throw Error("Invalid key length");
        }
        let map: RecursiveMap<K, V> | undefined = this.data;
        const lastKeyPos = key.length - 1;
        for (let i = 0; i < lastKeyPos; i++) {
            map = (map as RecursiveMap<K, V>).get(key[i]) as RecursiveMap<K, V>;
            if (!map) {
                return undefined;
            }
        }
        return map.get(key[lastKeyPos]);
    }

    public forEach(callbackfn: (value: V, key: K[]) => void): void {
        if (callbackfn.length < 2) {
            recurseForEachValue(callbackfn as (value: V) => void, this.keyLength - 1, this.data, 0);
        } else {
            recurseForEach(callbackfn, this.keyLength - 1, this.data, [], 0);
        }
    }

    public keys(): IterableIterator<K[]> {
        let level = 0;
        const lastLevel = this.keyLength - 1;
        let levelIterator: IterableIterator<[K, V | RecursiveMap<K, V>] | K> = lastLevel
            ? this.data.entries()
            : this.data.keys();
        const levelIterators: Array<typeof levelIterator> = [levelIterator];
        // TODO: Is key reuse performant?
        const key: K[] = [];

        const iterator: IterableIterator<K[]> = {
            [Symbol.iterator]() {
                return iterator;
            },
            next() {
                for (;;) {
                    const result = levelIterator.next();
                    if (result.done) {
                        if (level <= 0) {
                            return result as IteratorResult<K[]>;
                        }
                        levelIterator = levelIterators[--level];
                    } else if (level < lastLevel) {
                        key[level] = (result.value as [K, RecursiveMap<K, V>])[0];
                        level++;
                        levelIterator =
                            level === lastLevel
                                ? (result.value as [K, RecursiveMap<K, V>])[1].keys()
                                : (result.value as [K, RecursiveMap<K, V>])[1].entries();
                        levelIterators[level] = levelIterator;
                    } else {
                        const key2 = key.slice();
                        key2[level] = result.value as K;
                        return { value: key2, done: false };
                    }
                }
            },
        };
        return iterator;
    }

    public values(): IterableIterator<V> {
        let level = 0;
        let levelIterator = this.data.values();
        const levelIterators: Array<typeof levelIterator> = [levelIterator];
        const lastLevel = this.keyLength - 1;

        const iterator: IterableIterator<V> = {
            [Symbol.iterator]() {
                return iterator;
            },
            next() {
                for (;;) {
                    const result = levelIterator.next();
                    if (result.done) {
                        if (level <= 0) {
                            return result as IteratorResult<V>;
                        }
                        levelIterator = levelIterators[--level];
                    } else if (level < lastLevel) {
                        level++;
                        levelIterator = (result.value as RecursiveMap<K, V>).values();
                        levelIterators[level] = levelIterator;
                    } else {
                        return result as IteratorResult<V>;
                    }
                }
            },
        };
        return iterator;
    }

    public entries(): IterableIterator<[K[], V]> {
        let level = 0;
        let levelIterator = this.data.entries();
        const levelIterators: Array<typeof levelIterator> = [levelIterator];
        const lastLevel = this.keyLength - 1;
        const key: K[] = [];

        // TODO: Try using push/pop
        const iterator: IterableIterator<[K[], V]> = {
            [Symbol.iterator]() {
                return iterator;
            },
            next() {
                for (;;) {
                    const result = levelIterator.next();
                    if (result.done) {
                        if (level <= 0) {
                            return result as IteratorResult<[any, V]>;
                        }
                        levelIterator = levelIterators[--level];
                    } else if (level < lastLevel) {
                        key[level] = result.value[0];
                        level++;
                        levelIterator = (result.value[1] as RecursiveMap<K, V>).entries();
                        levelIterators[level] = levelIterator;
                    } else {
                        const key2 = key.slice();
                        key2[level] = result.value[0];
                        return { value: [key2, result.value[1]] as [K[], V], done: false };
                    }
                }
            },
        };
        return iterator;
    }

    public [Symbol.iterator](): IterableIterator<[K[], V]> {
        return this.entries();
    }

    public toJSON(): RecursiveEntries<K, V> {
        return getRecursiveEntries(this.keyLength - 1, this.data, 0);
    }

    private copySection(maps: Array<RecursiveMap<K, V>>, key: K[], keyPos: number): RecursiveMap<K, V> {
        if (!this.copiedSet) {
            return maps[keyPos];
        }
        let prevMap!: RecursiveMap<K, V>;

        for (let i = 0; i <= keyPos; i++) {
            let map = maps[i];
            if (!(this.copiedSet as Set<RecursiveMap<K, V>>).has(map)) {
                map = copyMap(map);
                (this.copiedSet as Set<RecursiveMap<K, V>>).add(map);
                if (i === 0) {
                    this.data = map;
                } else {
                    prevMap.set(key[i - 1], map);
                }
            }
            prevMap = map;
        }
        return prevMap;
    }
}

// tslint:disable:variable-name
export const CompositeMap1 = CompositeMap;
export const CompositeMap2 = CompositeMap;
export const CompositeMap3 = CompositeMap;
export const CompositeMap4 = CompositeMap;
export const CompositeMap5 = CompositeMap;
export const CompositeMap6 = CompositeMap;
export const CompositeMap7 = CompositeMap;
export const CompositeMap8 = CompositeMap;
export const CompositeMap9 = CompositeMap;
// tslint:enable:variable-name

function copyMap<K, V>(map: Map<K, V>): Map<K, V> {
    const newMap: Map<K, V> = new Map();
    map.forEach((value, key) => {
        newMap.set(key, value);
    });
    return newMap;
}

function copyMaps<K, V>(map: RecursiveMap<K, V>, keyLength: number, level: number): RecursiveMap<K, V> {
    if (level >= keyLength - 1) {
        return copyMap(map);
    }
    const mapCopy: RecursiveMap<K, V> = new Map();
    map.forEach((value, key) => {
        mapCopy.set(key, copyMaps(value as RecursiveMap<K, V>, keyLength, level + 1));
    });
    return mapCopy;
}

function recurseForEach<K, V>(
    callbackfn: (value: V, key: K[]) => void,
    lastKeyPart: number,
    map: RecursiveMap<K, V>,
    keyPart: K[],
    keyPos: number,
): void {
    if (keyPos === lastKeyPart) {
        map.forEach((value, key) => {
            const key2 = keyPart.slice();
            key2[keyPos] = key;
            callbackfn(value as V, key2);
        });
    } else {
        map.forEach((value, key) => {
            keyPart[keyPos] = key;
            recurseForEach(callbackfn, lastKeyPart, value as RecursiveMap<K, V>, keyPart, keyPos + 1);
        });
    }
}

function recurseForEachValue<K, V>(
    callbackfn: (value: V) => void,
    lastKeyPart: number,
    map: RecursiveMap<K, V>,
    keyPos: number,
): void {
    if (keyPos === lastKeyPart) {
        map.forEach((value) => {
            callbackfn(value as V);
        });
    } else {
        map.forEach((value) => {
            recurseForEachValue(callbackfn, lastKeyPart, value as RecursiveMap<K, V>, keyPos + 1);
        });
    }
}

function getRecursiveEntries<K, V>(lastKeyPos: number, map: RecursiveMap<K, V>, level: number): RecursiveEntries<K, V> {
    const entries: RecursiveEntries<K, V> = [];
    if (level >= lastKeyPos) {
        map.forEach((value, key) => {
            entries.push([key, value as V]);
        });
        return entries;
    }
    map.forEach((value, key) => {
        entries.push([key, getRecursiveEntries(lastKeyPos, value as RecursiveMap<K, V>, level + 1)]);
    });
    return entries;
}

function recursiveEntriesToRecursiveMap<K, V>(
    lastKeyPos: number,
    entries: RecursiveEntries<K, V>,
    level: number,
): RecursiveMap<K, V> {
    const map: RecursiveMap<K, V> = new Map();
    if (level >= lastKeyPos) {
        entries.forEach((entry) => {
            map.set(entry[0], entry[1] as V);
        });
    } else {
        entries.forEach((entry) => {
            map.set(
                entry[0],
                recursiveEntriesToRecursiveMap(lastKeyPos, entry[1] as RecursiveEntries<K, V>, level + 1),
            );
        });
    }
    return map;
}
