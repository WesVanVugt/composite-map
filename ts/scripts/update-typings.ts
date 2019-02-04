import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

const FILENAME = path.resolve(__dirname, "../../index.d.ts");

function getRecursiveMapInterfaces(keys: string[]): string {
    return (
        keys
            .map((_, i) => {
                if (!i) {
                    return "export interface RecursiveMap1<K1, V> extends Map<K1, V> {}";
                } else {
                    return (
                        `export interface RecursiveMap${i + 1}<${keys.slice(0, i + 1).join(", ")}, V> extends ` +
                        `Map<K1, RecursiveMap${i}<${keys.slice(1, i + 1).join(", ")}, V>> {}`
                    );
                }
            })
            .join("\n") +
        "\n" +
        keys
            .map((_, i) => {
                if (!i) {
                    return "export interface RecursiveEntries1<K1, V> extends Array<[K1, V]> {}";
                } else {
                    return (
                        `export interface RecursiveEntries${i + 1}<${keys.slice(0, i + 1).join(", ")}, V> ` +
                        `extends Array<[K1, RecursiveEntries${i}<${keys.slice(1, i + 1).join(", ")}, V>]> {}`
                    );
                }
            })
            .join("\n")
    );
}

function getCompositeMapDefinition(index: number, keys: string[]): string {
    const joinedKeys = keys.join(", ");
    const keySubsets = Array.from(new Array(keys.length + 1)).map(
        (_, i) => `[${keys.slice(0, keys.length - i).join(", ")}]`,
    );
    const qualifiedKeys: string = keys.join(", ");
    return (
        `export declare class CompositeMap${index + 1}<${qualifiedKeys}, V> {\n` +
        [
            `constructor();`,
            `constructor(` +
                `entries: CompositeMap${index + 1}<${joinedKeys}, V> | ` +
                `CompositeMap<${keys.join(" | ")}, V>, ` +
                `options?: CompositeMapOptions` +
                `);`,
            `constructor(` +
                `entries: RecursiveEntries${index + 1}<${joinedKeys}, V> | RecursiveEntries<${keys.join(" | ")}, V>, ` +
                `options: CompositeMapOptions & { keyLength: ${index + 1} }` +
                `);`,
            `set(key: [${joinedKeys}], value: V): this;`,
            `clear(): void;`,
            `delete(key: ${keySubsets.join(" | ")}): boolean;`,
            `has(key: ${keySubsets.join(" | ")}): boolean;`,
            `get(key: ${keySubsets[0]}): V | undefined;`,
            ...keySubsets
                .slice(1)
                .map(
                    (key, i) =>
                        `get(key: ${key}): RecursiveMap${i + 1}<${keys.slice(-1 - i).join(", ")}, V> | undefined;`,
                ),
            `forEach(callbackfn: (value: V, key: ${keySubsets[0]}) => void): void;`,
            `keys(): IterableIterator<${keySubsets[0]}>;`,
            `values(): IterableIterator<V>;`,
            `entries(): IterableIterator<[${keySubsets[0]}, V]>;`,
            `[Symbol.iterator](): IterableIterator<[${keySubsets[0]}, V]>;`,
            `toJSON(): RecursiveEntries${index + 1}<${joinedKeys}, V>;`,
        ]
            .map((v) => `    ${v}\n`)
            .join("") +
        `}`
    );
}

function getCompositeMapDefinitions(keys: string[]): string {
    return keys.map((_, i) => getCompositeMapDefinition(i, keys.slice(0, i + 1))).join("\n");
}

function main(): void {
    let content = fs.readFileSync(FILENAME).toString();
    const regExp = new RegExp(`^export declare const CompositeMap(\\d+): typeof CompositeMap;$`, "gm");
    let firstIndex: number = -1;
    let lastIndex: number = -1;
    let count = 0;
    for (;;) {
        const matches = regExp.exec(content);
        if (!matches) {
            break;
        }
        count++;
        assert.strictEqual(+matches[1], count);
        if (firstIndex === -1) {
            firstIndex = matches.index;
        }
        lastIndex = regExp.lastIndex;
    }
    assert.ok(count);
    assert.strictEqual(content.slice(firstIndex, lastIndex).split("\n").length, count);
    const keys = Array.from(new Array(count)).map((_v, x) => `K${x + 1}`);

    content =
        content.slice(0, firstIndex) +
        getRecursiveMapInterfaces(keys) +
        "\n" +
        getCompositeMapDefinitions(keys) +
        content.slice(lastIndex + 1);
    content = content.replace(
        `constructor(entries: CompositeMap<K, V>,`,
        `constructor(entries: CompositeMap<K, V> | ${keys
            .map((_, i) => `CompositeMap${i + 1}<${"K, ".repeat(i + 1)}V>`)
            .join(" | ")},`,
    );
    fs.writeFileSync(FILENAME, content, "utf8");
}

main();
