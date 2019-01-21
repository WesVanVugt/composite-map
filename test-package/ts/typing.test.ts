import { CompositeMap, CompositeMap2, CompositeMap3, RecursiveEntries, RecursiveEntries2 } from "composite-map";

enum StringEnum {
    String1 = "String1",
    String2 = "String2",
}

enum NumberEnum {
    Number1,
    Number2,
}

enum MixedEnum {
    Number1,
    String1 = "String1",
}

describe("Typing Tests", () => {
    it("CompositeMap", () => {
        const map = new CompositeMap2<"a", 1, boolean>();
        assertType<CompositeMap2<"a", 1, boolean>>(new CompositeMap2(map));
        assertType<CompositeMap2<"a", 1, boolean>>(new CompositeMap2(map.toJSON(), { keyLength: 2 }));
        assertType<CompositeMap2<"a", 1, boolean>>(
            new CompositeMap2<"a", 1, boolean>(map.toJSON() as RecursiveEntries<"a" | 1, boolean>, { keyLength: 2 }),
        );
        assertType<CompositeMap2<"a", 1, boolean>>(
            new CompositeMap2<"a", 1, boolean>(new CompositeMap<"a" | 1, boolean>()),
        );
        assertType<CompositeMap<"a" | 1, boolean>>(new CompositeMap(new CompositeMap2<"a", 1, boolean>()));
        assertType<CompositeMap3<StringEnum, NumberEnum, MixedEnum, boolean>>(
            new CompositeMap3<StringEnum, NumberEnum, MixedEnum, boolean>(),
        );
        assertType<RecursiveEntries2<"a", 1, boolean>>([["a", [[1, true]]]]);
        assertType<boolean>(map.delete([]));
        assertType<boolean>(map.delete(["a"]));
        assertType<boolean>(map.delete(["a", 1]));
        map.clear();
        map.set(["a", 1], true);
        assertType<boolean | undefined>(map.get(["a", 1]));
        assertType<Map<1, boolean> | undefined>(map.get(["a"]));
        assertType<Map<"a", Map<1, boolean>> | undefined>(map.get([]));
        assertType<boolean>(map.has([]));
        assertType<boolean>(map.has(["a"]));
        assertType<boolean>(map.has(["a", 1]));
        map.forEach((value, key) => {
            assertType<boolean>(value);
            assertType<["a", 1]>(key);
        });
        assertType<IterableIterator<boolean>>(map.values());
        assertType<IterableIterator<["a", 1]>>(map.keys());
        assertType<IterableIterator<[["a", 1], boolean]>>(map.entries());
        assertType<Array<["a", Array<[1, boolean]>]>>(map.toJSON());
    });
});

function assertType<T>(_v: T): void {
    // Only used for typechecking at compile
}
