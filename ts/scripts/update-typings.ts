// tslint:disable:no-console
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";

function getRecursiveMapInterfaces(count: number, keys: string[]): string {
    return (
        Array.from(new Array(count))
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
        Array.from(new Array(count))
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

function getCompositeMapDefinition(
    index: number,
    keys: string[],
    className: string,
    recursiveType: string,
    jsonType: string,
    keyQualifier: string,
): string {
    const joinedKeys = keys.join(", ");
    const keySubsets = Array.from(new Array(keys.length + 1)).map(
        (_, i) => `[${keys.slice(0, keys.length - i).join(", ")}]`,
    );
    const qualifiedKeys: string = keys.map((key) => `${key}${keyQualifier}`).join(", ");
    return (
        `export declare class ${className}${index + 1}<${qualifiedKeys}, V> {\n` +
        [
            `constructor();`,
            `constructor(` +
                `entries: ${className}${index + 1}<${joinedKeys}, V> | ` +
                `${className}<${keys.join(" | ")}, V>, ` +
                `options?: ${className}Options` +
                `);`,
            `constructor(` +
                `entries: ${jsonType}${index + 1}<${joinedKeys}, V> | ${jsonType}<${keys.join(" | ")}, V>, ` +
                `options: ${className}Options & { keyLength: ${index + 1} }` +
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
                        `get(key: ${key}): ${recursiveType}${i + 1}<${keys.slice(-1 - i).join(", ")}, V> | undefined;`,
                ),
            `forEach(callbackfn: (value: V, key: ${keySubsets[0]}) => void): void;`,
            `keys(): IterableIterator<${keySubsets[0]}>;`,
            `values(): IterableIterator<V>;`,
            `entries(): IterableIterator<[${keySubsets[0]}, V]>;`,
            `[Symbol.iterator](): IterableIterator<[${keySubsets[0]}, V]>;`,
            `toJSON(): ${jsonType}${index + 1}<${joinedKeys}, V>;`,
        ]
            .map((v) => `    ${v}\n`)
            .join("") +
        `}`
    );
}

function getCompositeMapDefinitions(
    keys: string[],
    className: string,
    recursiveType: string,
    jsonType: string,
    keyQualifier: string,
): string {
    return keys
        .map((_, i) =>
            getCompositeMapDefinition(i, keys.slice(0, i + 1), className, recursiveType, jsonType, keyQualifier),
        )
        .join("\n");
}

function getPath(filename: string): string {
    return path.resolve(__dirname, "../..", filename);
}

function readLibFile(filename: string): string {
    return fs.readFileSync(getPath(filename)).toString();
}

function writeLibFile(filename: string, content: string): void {
    fs.writeFileSync(getPath(filename), content, "utf8");
}

function updateFile(
    filename: string,
    className: string,
    recursiveType: string,
    jsonType: string,
    keyQualifier: string,
    getRecursiveTypes: (count: number, keys: string[]) => string,
): void {
    let content = readLibFile(filename);
    const regExp = new RegExp(`^export declare const ${className}(\\d+): typeof ${className};$`, "gm");
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
        getRecursiveTypes(count, keys) +
        "\n" +
        getCompositeMapDefinitions(keys, className, recursiveType, jsonType, keyQualifier) +
        content.slice(lastIndex + 1);
    content = content.replace(
        `constructor(entries: ${className}<K, V>,`,
        `constructor(entries: ${className}<K, V> | ${keys
            .map((_, i) => `${className}${i + 1}<${(keyQualifier ? "any, " : "K, ").repeat(i + 1)}V>`)
            .join(" | ")},`,
    );
    writeLibFile(filename, content);
}

updateFile("index.d.ts", "CompositeMap", "RecursiveMap", "RecursiveEntries", "", getRecursiveMapInterfaces);
