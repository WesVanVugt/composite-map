import { expect } from "chai";
import { CompositeMap, RecursiveEntries } from "./imports";

function jsonClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

describe("composite-map", () => {
    it(".prototype.get(key)", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        expect(map.get(["a", "b"])).to.equal("test");
        expect(map.get(["b", "a"])).to.equal("test2");
        expect(map.get(["a", "c"])).to.equal(undefined);
    });

    it(".prototype.has(key)", () => {
        const map = new CompositeMap<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        expect(map.has(["a", "c"])).to.equal(false);
    });

    it(".prototype.delete(key)", () => {
        const map = new CompositeMap<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        expect(map.delete(["a", "c"])).to.equal(false);
        expect(map.delete(["a", "b"])).to.equal(true);
        expect(map.has(["a", "b"])).to.equal(false);
        expect(map.delete(["a", "b"])).to.equal(false);
    });

    it(".prototype.clear()", () => {
        const map = new CompositeMap<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a", "b"])).to.equal(true);
        map.clear();
        expect(map.has(["a", "b"])).to.equal(false);
    });

    it(".prototype.forEach((value, key) => {})", () => {
        const map = new CompositeMap<string, string>();
        map.set(["b", "a"], "test").set(["a", "b"], "test2");
        const output: Array<[string[], string]> = [];

        map.forEach((value, key) => {
            output.push([key, value]);
        });
        expect(output).to.deep.equal([[["b", "a"], "test"], [["a", "b"], "test2"]]);
    });

    it(".prototype.forEach((value) => {})", () => {
        const map = new CompositeMap<string, string>();
        map.set(["b", "a"], "test").set(["a", "b"], "test2");
        const output: string[] = [];

        map.forEach((value) => {
            output.push(value);
        });
        expect(output).to.deep.equal(["test", "test2"]);
    });

    it(".prototype.entries() / .prototype[@@iterator]()", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map)).to.deep.equal([[["a", "a", "a"], "test"], [["b", "a", "a"], "test2"]]);
        expect(Array.from(map.entries())).to.deep.equal([[["a", "a", "a"], "test"], [["b", "a", "a"], "test2"]]);
    });

    it(".prototype.keys()", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map.keys())).to.deep.equal([["a", "a", "a"], ["b", "a", "a"]]);
        map.clear();
        map.set(["a"], "test").set(["b"], "test2");
        expect(Array.from(map.keys())).to.deep.equal([["a"], ["b"]]);
    });

    it(".prototype.values()", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "a", "a"], "test").set(["b", "a", "a"], "test2");
        expect(Array.from(map.values())).to.deep.equal(["test", "test2"]);
    });

    it("constructor(map)", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test");
        const mapCopy = new CompositeMap(map);
        expect(mapCopy.get(["a", "b"])).to.equal("test");
    });

    it(".prototype.set(long_key)", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test");
        expect(() => map.set(["c", "d", "e"], "test2")).to.throw(/^Invalid key length$/);
    });

    it(".prototype.delete(long_key)", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test");
        expect(() => map.delete(["c", "d", "e"])).to.throw(/^Invalid key length$/);
    });

    it(".prototype.has(long_key)", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test");
        expect(() => map.has(["c", "d", "e"])).to.throw(/^Invalid key length$/);
    });

    it(".prototype.get(long_key)", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test");
        expect(() => map.get(["c", "d", "e"])).to.throw(/^Invalid key length$/);
    });

    it(".prototype.has(short_key)", () => {
        const map = new CompositeMap<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.has(["a"])).to.equal(true);
        expect(map.has(["b"])).to.equal(false);
    });

    it(".prototype.has(zero_length_key)", () => {
        const map = new CompositeMap<string, boolean>();
        expect(map.has([])).to.equal(false);
        map.set(["a", "b"], true);
        expect(map.has([])).to.equal(true);
    });

    it(".prototype.delete(short_key)", () => {
        const map = new CompositeMap<string, boolean>();
        map.set(["a", "b"], true).set(["a", "c"], true);
        expect(map.delete(["a"])).to.equal(true);
        expect(map.get(["a", "b"])).to.equal(undefined);
        expect(map.get(["a", "c"])).to.equal(undefined);
    });

    it(".prototype.delete(zero_length_key)", () => {
        const map = new CompositeMap<string, boolean>();
        map.set(["a", "b"], true);
        expect(map.delete([])).to.equal(true);
        expect(map.get(["a", "b"])).to.equal(undefined);
        expect(map.delete([])).to.equal(false);

        // Try deleting root when the keyLength is non-zero
        map.set(["a", "b"], true).delete(["a", "b"]);
        expect(map.delete([])).to.equal(false);
    });

    it('constructor(map, { copy: "on-write" }), .prototype.set(key, value)', () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test")
            .set(["b", "a"], "test2")
            .set(["c", "a"], "test3");
        expect((map as any).copiedSet).to.equal(undefined);
        const mapCopy = new CompositeMap(map, { copy: "on-write" });

        expect((mapCopy as any).copiedSet).to.be.a("WeakSet");
        expect(mapCopy.get(["a", "b"])).to.equal("test");
        expect(mapCopy.get([])).to.equal(map.get([]), "The unmodified copy should use the same root map object");

        mapCopy.set(["a", "b"], "test4");
        expect(mapCopy.get(["a", "b"])).to.equal("test4");
        expect(map.get(["a", "b"])).to.equal("test", "The original map should remain unchanged");
        const newRootMap = mapCopy.get([]);
        expect(newRootMap).to.not.equal(map.get([]), "Changes should result in the root map being duplicated");
        expect(mapCopy.get(["b"])).to.equal(map.get(["b"]), "The unmodified sub-map should still be shared");

        mapCopy.set(["b", "a"], "test5");
        expect(mapCopy.get([])).to.equal(newRootMap, "Further changes should not result in excess duplication");

        map.set(["c", "a"], "test6");
        expect(mapCopy.get(["c", "a"])).to.equal("test3", "Changes to the original map should not affect the copy");

        const mapCopy2 = new CompositeMap(map, { copy: "on-write" });
        map.set(["d", "a"], "test7");
        expect(mapCopy2.get(["d", "a"])).to.equal(undefined);
    });

    it('constructor(map, { copy: "on-write" }), .prototype.delete(key)', () => {
        const map = new CompositeMap<string, string>();
        // Note: Unless a sub-map has multiple entries, pruning will cause the sub-map to remain unchanged since it
        //   would instead be deleted by its parent.
        map.set(["a", "a"], "test")
            .set(["a", "b"], "test2")
            .set(["b", "a"], "test3")
            .set(["b", "b"], "test4");
        const mapCopy = new CompositeMap(map, { copy: "on-write" });

        expect(mapCopy.get(["a", "a"])).to.equal("test");
        expect(mapCopy.get([])).to.equal(map.get([]), "The unmodified copy should use the same root map object");

        expect(mapCopy.delete(["a", "a"])).to.equal(true);
        expect(map.has(["a", "a"])).to.equal(true, "The original map should remain unchanged");
        const newRootMap = mapCopy.get([]);
        expect(newRootMap).to.not.equal(map.get([]), "Changes should result in the root map being duplicated");

        expect(mapCopy.delete(["a", "b"])).to.equal(true);
        expect(mapCopy.get([])).to.equal(newRootMap, "Further changes should not result in excess duplication");

        expect(mapCopy.get(["b"])).to.equal(map.get(["b"]), "The unmodified sub-map should still be shared");
        expect(map.delete(["b", "a"])).to.equal(true);
        expect(mapCopy.has(["b", "a"])).to.equal(true, "Changes to the original map should not affect the copy");
    });

    it('constructor(map, { copy: "on-write" }), .prototype.delete(zero_length_key)', () => {
        const map = new CompositeMap<string, string>();
        // tslint:disable-next-line:no-unused-expression
        new CompositeMap(map, { copy: "on-write" });

        expect((map as any).copiedSet).to.be.a("WeakSet");
        expect(map.delete([])).to.equal(false, "delete when the map has no keyLength");
        expect((map as any).copiedSet).to.equal(undefined);

        map.set(["a"], "test");
        // tslint:disable-next-line:no-unused-expression
        new CompositeMap(map, { copy: "on-write" });
        expect((map as any).copiedSet).to.be.a("WeakSet");
        (map.get([]) as Map<string, string>).clear();
        expect(map.delete([])).to.equal(false, "delete when the map has a keyLength but no records");
        expect((map as any).copiedSet).to.equal(undefined);
    });

    it('constructor(map, { copy: "on-write" }), .prototype.clear()', () => {
        const map = new CompositeMap<string, string>();
        // Note: Unless a sub-map has multiple entries, pruning will cause the sub-map to remain unchanged since it
        //   would instead be deleted by its parent.
        map.set(["a", "a"], "test");
        const mapCopy = new CompositeMap(map, { copy: "on-write" });

        expect(map.has(["a", "a"])).to.equal(true);
        expect((map as any).copiedSet).to.be.a("WeakSet");
        map.clear();
        expect(map.has(["a", "a"])).to.equal(false);
        expect((map as any).copiedSet).to.equal(undefined);
        expect(mapCopy.has(["a", "a"])).to.equal(true);
    });

    it('constructor(map, { copy: "keys" })', () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        // The default option is to copy the keys, so no options need to be set
        const mapCopy = new CompositeMap(map);

        expect((mapCopy as any).copiedSet).to.equal(undefined);
        expect(mapCopy.get(["a", "b"])).to.equal("test");
        expect(mapCopy.get([])).not.to.equal(map.get([]), "The unmodified copy should still have a different map");

        mapCopy.set(["a", "b"], "test3");
        expect(mapCopy.get(["a", "b"])).to.equal("test3");
        expect(map.get(["a", "b"])).to.equal("test", "The original map should remain unchanged");
    });

    it('constructor(map, { copy: "invalid" })', () => {
        const map = new CompositeMap<string, string>();
        expect(() => new CompositeMap(map, { copy: "invalid" as any })).to.throw(
            /^Unrecognized copy method 'invalid'$/,
        );
    });

    // TODO: Test pruning forgetfulness. Also, this is not a copy-on-write test
    it(".prototype.delete() [pruning]", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b", "c"], "test").set(["a", "c", "d"], "test2");

        expect(map.get(["a", "b"])).to.not.equal(undefined);
        map.delete(["a", "b", "c"]);
        expect(map.get(["a", "b"])).to.equal(undefined);

        expect(map.get(["a"])).to.not.equal(undefined);
        map.delete(["a", "c", "d"]);
        expect(map.get(["a"])).to.equal(undefined);
    });

    it(".prototype.get(short_key)", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test");
        expect((map.get(["a"]) as Map<string, string>).get("b")).to.equal("test");
        expect(map.get(["b"])).to.equal(undefined);
    });

    it(".prototype.get(zero_length_key)", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test");
        expect(((map.get([]) as Map<string, Map<string, string>>).get("a") as Map<string, string>).get("b")).to.equal(
            "test",
        );
    });

    it(".prototype.toJSON() []", () => {
        const map = new CompositeMap<string, string>();
        map.set(["a", "b"], "test").set(["b", "a"], "test2");
        const json = jsonClone(map);
        expect(json).to.deep.equal([["a", [["b", "test"]]], ["b", [["a", "test2"]]]]);
    });

    it("constructor(entries, { length: 2 })", () => {
        const entries: RecursiveEntries<string, string> = [["a", [["b", "test"]]], ["b", [["a", "test2"]]]];
        const map = new CompositeMap<string, string>(entries, { keyLength: 2 });
        expect(jsonClone(map)).to.deep.equal(entries);
    });

    it("constructor(entries)", () => {
        expect(() => new CompositeMap<string, string>([], undefined as any)).to.throw(
            /^Array inputs require a non-zero value for options.keyLength$/,
        );
    });
});
