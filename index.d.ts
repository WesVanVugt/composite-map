export interface RecursiveMap<K, V> extends Map<K, RecursiveMap<K, V> | V> {
}
export interface RecursiveEntries<K, V> extends Array<[K, RecursiveEntries<K, V> | V]> {
}
export declare type CompositeMapCopyMethod = "on-write" | "keys";
export interface CompositeMapOptions {
    /**
     * Indicates when CompositeMap key data passed to the constructor is copied.
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
export declare class CompositeMap<K, V> {
    private data;
    private keyLength;
    private copiedSet?;
    constructor();
    constructor(entries: CompositeMap<K, V> | CompositeMap1<K, V> | CompositeMap2<K, K, V> | CompositeMap3<K, K, K, V> | CompositeMap4<K, K, K, K, V> | CompositeMap5<K, K, K, K, K, V> | CompositeMap6<K, K, K, K, K, K, V> | CompositeMap7<K, K, K, K, K, K, K, V> | CompositeMap8<K, K, K, K, K, K, K, K, V> | CompositeMap9<K, K, K, K, K, K, K, K, K, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries<K, V>, options: CompositeMapOptions & {
        keyLength: number;
    });
    set(key: K[], value: V): this;
    clear(): void;
    delete(key: K[]): boolean;
    has(key: K[]): boolean;
    get(key: K[]): V | RecursiveMap<K, V> | undefined;
    forEach(callbackfn: (value: V, key: K[]) => void): void;
    keys(): IterableIterator<K[]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K[], V]>;
    [Symbol.iterator](): IterableIterator<[K[], V]>;
    toJSON(): RecursiveEntries<K, V>;
    private copySection;
}
export interface RecursiveMap1<K1, V> extends Map<K1, V> {}
export interface RecursiveMap2<K1, K2, V> extends Map<K1, RecursiveMap1<K2, V>> {}
export interface RecursiveMap3<K1, K2, K3, V> extends Map<K1, RecursiveMap2<K2, K3, V>> {}
export interface RecursiveMap4<K1, K2, K3, K4, V> extends Map<K1, RecursiveMap3<K2, K3, K4, V>> {}
export interface RecursiveMap5<K1, K2, K3, K4, K5, V> extends Map<K1, RecursiveMap4<K2, K3, K4, K5, V>> {}
export interface RecursiveMap6<K1, K2, K3, K4, K5, K6, V> extends Map<K1, RecursiveMap5<K2, K3, K4, K5, K6, V>> {}
export interface RecursiveMap7<K1, K2, K3, K4, K5, K6, K7, V> extends Map<K1, RecursiveMap6<K2, K3, K4, K5, K6, K7, V>> {}
export interface RecursiveMap8<K1, K2, K3, K4, K5, K6, K7, K8, V> extends Map<K1, RecursiveMap7<K2, K3, K4, K5, K6, K7, K8, V>> {}
export interface RecursiveMap9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> extends Map<K1, RecursiveMap8<K2, K3, K4, K5, K6, K7, K8, K9, V>> {}
export interface RecursiveEntries1<K1, V> extends Array<[K1, V]> {}
export interface RecursiveEntries2<K1, K2, V> extends Array<[K1, RecursiveEntries1<K2, V>]> {}
export interface RecursiveEntries3<K1, K2, K3, V> extends Array<[K1, RecursiveEntries2<K2, K3, V>]> {}
export interface RecursiveEntries4<K1, K2, K3, K4, V> extends Array<[K1, RecursiveEntries3<K2, K3, K4, V>]> {}
export interface RecursiveEntries5<K1, K2, K3, K4, K5, V> extends Array<[K1, RecursiveEntries4<K2, K3, K4, K5, V>]> {}
export interface RecursiveEntries6<K1, K2, K3, K4, K5, K6, V> extends Array<[K1, RecursiveEntries5<K2, K3, K4, K5, K6, V>]> {}
export interface RecursiveEntries7<K1, K2, K3, K4, K5, K6, K7, V> extends Array<[K1, RecursiveEntries6<K2, K3, K4, K5, K6, K7, V>]> {}
export interface RecursiveEntries8<K1, K2, K3, K4, K5, K6, K7, K8, V> extends Array<[K1, RecursiveEntries7<K2, K3, K4, K5, K6, K7, K8, V>]> {}
export interface RecursiveEntries9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> extends Array<[K1, RecursiveEntries8<K2, K3, K4, K5, K6, K7, K8, K9, V>]> {}
export declare class CompositeMap1<K1, V> {
    constructor();
    constructor(entries: CompositeMap1<K1, V> | CompositeMap<K1, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries1<K1, V> | RecursiveEntries<K1, V>, options: CompositeMapOptions & { keyLength: 1 });
    set(key: [K1], value: V): this;
    clear(): void;
    delete(key: [K1] | []): boolean;
    has(key: [K1] | []): boolean;
    get(key: [K1]): V | undefined;
    get(key: []): RecursiveMap1<K1, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1]) => void): void;
    keys(): IterableIterator<[K1]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1], V]>;
    [Symbol.iterator](): IterableIterator<[[K1], V]>;
    toJSON(): RecursiveEntries1<K1, V>;
}
export declare class CompositeMap2<K1, K2, V> {
    constructor();
    constructor(entries: CompositeMap2<K1, K2, V> | CompositeMap<K1 | K2, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries2<K1, K2, V> | RecursiveEntries<K1 | K2, V>, options: CompositeMapOptions & { keyLength: 2 });
    set(key: [K1, K2], value: V): this;
    clear(): void;
    delete(key: [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2]): V | undefined;
    get(key: [K1]): RecursiveMap1<K2, V> | undefined;
    get(key: []): RecursiveMap2<K1, K2, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2]) => void): void;
    keys(): IterableIterator<[K1, K2]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2], V]>;
    toJSON(): RecursiveEntries2<K1, K2, V>;
}
export declare class CompositeMap3<K1, K2, K3, V> {
    constructor();
    constructor(entries: CompositeMap3<K1, K2, K3, V> | CompositeMap<K1 | K2 | K3, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries3<K1, K2, K3, V> | RecursiveEntries<K1 | K2 | K3, V>, options: CompositeMapOptions & { keyLength: 3 });
    set(key: [K1, K2, K3], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3]): V | undefined;
    get(key: [K1, K2]): RecursiveMap1<K3, V> | undefined;
    get(key: [K1]): RecursiveMap2<K2, K3, V> | undefined;
    get(key: []): RecursiveMap3<K1, K2, K3, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3]) => void): void;
    keys(): IterableIterator<[K1, K2, K3]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3], V]>;
    toJSON(): RecursiveEntries3<K1, K2, K3, V>;
}
export declare class CompositeMap4<K1, K2, K3, K4, V> {
    constructor();
    constructor(entries: CompositeMap4<K1, K2, K3, K4, V> | CompositeMap<K1 | K2 | K3 | K4, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries4<K1, K2, K3, K4, V> | RecursiveEntries<K1 | K2 | K3 | K4, V>, options: CompositeMapOptions & { keyLength: 4 });
    set(key: [K1, K2, K3, K4], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4]): V | undefined;
    get(key: [K1, K2, K3]): RecursiveMap1<K4, V> | undefined;
    get(key: [K1, K2]): RecursiveMap2<K3, K4, V> | undefined;
    get(key: [K1]): RecursiveMap3<K2, K3, K4, V> | undefined;
    get(key: []): RecursiveMap4<K1, K2, K3, K4, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4], V]>;
    toJSON(): RecursiveEntries4<K1, K2, K3, K4, V>;
}
export declare class CompositeMap5<K1, K2, K3, K4, K5, V> {
    constructor();
    constructor(entries: CompositeMap5<K1, K2, K3, K4, K5, V> | CompositeMap<K1 | K2 | K3 | K4 | K5, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries5<K1, K2, K3, K4, K5, V> | RecursiveEntries<K1 | K2 | K3 | K4 | K5, V>, options: CompositeMapOptions & { keyLength: 5 });
    set(key: [K1, K2, K3, K4, K5], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5]): V | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveMap1<K5, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveMap2<K4, K5, V> | undefined;
    get(key: [K1, K2]): RecursiveMap3<K3, K4, K5, V> | undefined;
    get(key: [K1]): RecursiveMap4<K2, K3, K4, K5, V> | undefined;
    get(key: []): RecursiveMap5<K1, K2, K3, K4, K5, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5], V]>;
    toJSON(): RecursiveEntries5<K1, K2, K3, K4, K5, V>;
}
export declare class CompositeMap6<K1, K2, K3, K4, K5, K6, V> {
    constructor();
    constructor(entries: CompositeMap6<K1, K2, K3, K4, K5, K6, V> | CompositeMap<K1 | K2 | K3 | K4 | K5 | K6, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries6<K1, K2, K3, K4, K5, K6, V> | RecursiveEntries<K1 | K2 | K3 | K4 | K5 | K6, V>, options: CompositeMapOptions & { keyLength: 6 });
    set(key: [K1, K2, K3, K4, K5, K6], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5, K6]): V | undefined;
    get(key: [K1, K2, K3, K4, K5]): RecursiveMap1<K6, V> | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveMap2<K5, K6, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveMap3<K4, K5, K6, V> | undefined;
    get(key: [K1, K2]): RecursiveMap4<K3, K4, K5, K6, V> | undefined;
    get(key: [K1]): RecursiveMap5<K2, K3, K4, K5, K6, V> | undefined;
    get(key: []): RecursiveMap6<K1, K2, K3, K4, K5, K6, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5, K6]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5, K6]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5, K6], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5, K6], V]>;
    toJSON(): RecursiveEntries6<K1, K2, K3, K4, K5, K6, V>;
}
export declare class CompositeMap7<K1, K2, K3, K4, K5, K6, K7, V> {
    constructor();
    constructor(entries: CompositeMap7<K1, K2, K3, K4, K5, K6, K7, V> | CompositeMap<K1 | K2 | K3 | K4 | K5 | K6 | K7, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries7<K1, K2, K3, K4, K5, K6, K7, V> | RecursiveEntries<K1 | K2 | K3 | K4 | K5 | K6 | K7, V>, options: CompositeMapOptions & { keyLength: 7 });
    set(key: [K1, K2, K3, K4, K5, K6, K7], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5, K6, K7]): V | undefined;
    get(key: [K1, K2, K3, K4, K5, K6]): RecursiveMap1<K7, V> | undefined;
    get(key: [K1, K2, K3, K4, K5]): RecursiveMap2<K6, K7, V> | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveMap3<K5, K6, K7, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveMap4<K4, K5, K6, K7, V> | undefined;
    get(key: [K1, K2]): RecursiveMap5<K3, K4, K5, K6, K7, V> | undefined;
    get(key: [K1]): RecursiveMap6<K2, K3, K4, K5, K6, K7, V> | undefined;
    get(key: []): RecursiveMap7<K1, K2, K3, K4, K5, K6, K7, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5, K6, K7]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5, K6, K7]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7], V]>;
    toJSON(): RecursiveEntries7<K1, K2, K3, K4, K5, K6, K7, V>;
}
export declare class CompositeMap8<K1, K2, K3, K4, K5, K6, K7, K8, V> {
    constructor();
    constructor(entries: CompositeMap8<K1, K2, K3, K4, K5, K6, K7, K8, V> | CompositeMap<K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries8<K1, K2, K3, K4, K5, K6, K7, K8, V> | RecursiveEntries<K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8, V>, options: CompositeMapOptions & { keyLength: 8 });
    set(key: [K1, K2, K3, K4, K5, K6, K7, K8], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5, K6, K7, K8] | [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5, K6, K7, K8] | [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5, K6, K7, K8]): V | undefined;
    get(key: [K1, K2, K3, K4, K5, K6, K7]): RecursiveMap1<K8, V> | undefined;
    get(key: [K1, K2, K3, K4, K5, K6]): RecursiveMap2<K7, K8, V> | undefined;
    get(key: [K1, K2, K3, K4, K5]): RecursiveMap3<K6, K7, K8, V> | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveMap4<K5, K6, K7, K8, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveMap5<K4, K5, K6, K7, K8, V> | undefined;
    get(key: [K1, K2]): RecursiveMap6<K3, K4, K5, K6, K7, K8, V> | undefined;
    get(key: [K1]): RecursiveMap7<K2, K3, K4, K5, K6, K7, K8, V> | undefined;
    get(key: []): RecursiveMap8<K1, K2, K3, K4, K5, K6, K7, K8, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5, K6, K7, K8]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5, K6, K7, K8]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7, K8], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7, K8], V]>;
    toJSON(): RecursiveEntries8<K1, K2, K3, K4, K5, K6, K7, K8, V>;
}
export declare class CompositeMap9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> {
    constructor();
    constructor(entries: CompositeMap9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> | CompositeMap<K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9, V>, options?: CompositeMapOptions);
    constructor(entries: RecursiveEntries9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> | RecursiveEntries<K1 | K2 | K3 | K4 | K5 | K6 | K7 | K8 | K9, V>, options: CompositeMapOptions & { keyLength: 9 });
    set(key: [K1, K2, K3, K4, K5, K6, K7, K8, K9], value: V): this;
    clear(): void;
    delete(key: [K1, K2, K3, K4, K5, K6, K7, K8, K9] | [K1, K2, K3, K4, K5, K6, K7, K8] | [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    has(key: [K1, K2, K3, K4, K5, K6, K7, K8, K9] | [K1, K2, K3, K4, K5, K6, K7, K8] | [K1, K2, K3, K4, K5, K6, K7] | [K1, K2, K3, K4, K5, K6] | [K1, K2, K3, K4, K5] | [K1, K2, K3, K4] | [K1, K2, K3] | [K1, K2] | [K1] | []): boolean;
    get(key: [K1, K2, K3, K4, K5, K6, K7, K8, K9]): V | undefined;
    get(key: [K1, K2, K3, K4, K5, K6, K7, K8]): RecursiveMap1<K9, V> | undefined;
    get(key: [K1, K2, K3, K4, K5, K6, K7]): RecursiveMap2<K8, K9, V> | undefined;
    get(key: [K1, K2, K3, K4, K5, K6]): RecursiveMap3<K7, K8, K9, V> | undefined;
    get(key: [K1, K2, K3, K4, K5]): RecursiveMap4<K6, K7, K8, K9, V> | undefined;
    get(key: [K1, K2, K3, K4]): RecursiveMap5<K5, K6, K7, K8, K9, V> | undefined;
    get(key: [K1, K2, K3]): RecursiveMap6<K4, K5, K6, K7, K8, K9, V> | undefined;
    get(key: [K1, K2]): RecursiveMap7<K3, K4, K5, K6, K7, K8, K9, V> | undefined;
    get(key: [K1]): RecursiveMap8<K2, K3, K4, K5, K6, K7, K8, K9, V> | undefined;
    get(key: []): RecursiveMap9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V> | undefined;
    forEach(callbackfn: (value: V, key: [K1, K2, K3, K4, K5, K6, K7, K8, K9]) => void): void;
    keys(): IterableIterator<[K1, K2, K3, K4, K5, K6, K7, K8, K9]>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7, K8, K9], V]>;
    [Symbol.iterator](): IterableIterator<[[K1, K2, K3, K4, K5, K6, K7, K8, K9], V]>;
    toJSON(): RecursiveEntries9<K1, K2, K3, K4, K5, K6, K7, K8, K9, V>;
}