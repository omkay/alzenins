import { describe, expect, it } from "vitest";
import ar from "../messages/ar.json";
import en from "../messages/en.json";

type Tree = { [key: string]: string | Tree };

function paths(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : paths(value, path);
  });
}

function at(tree: Tree, path: string): string | Tree | undefined {
  return path
    .split(".")
    .reduce<string | Tree | undefined>(
      (node, key) =>
        node && typeof node !== "string" ? node[key] : undefined,
      tree,
    );
}

/** `{name}` / `{count}` — the values next-intl will interpolate. */
function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)/g)].map((m) => m[1]!).sort();
}

const arPaths = paths(ar as Tree);
const enPaths = paths(en as Tree);

describe("message catalogues", () => {
  it("has no key present in one locale but missing from the other", () => {
    expect(arPaths.filter((p) => !enPaths.includes(p))).toEqual([]);
    expect(enPaths.filter((p) => !arPaths.includes(p))).toEqual([]);
  });

  it("uses the same placeholders in both locales", () => {
    // A translated string that drops {email} renders a sentence with a hole in
    // it — the kind of bug nobody notices until a student sees it.
    for (const path of arPaths) {
      const arValue = at(ar as Tree, path);
      const enValue = at(en as Tree, path);
      if (typeof arValue !== "string" || typeof enValue !== "string") continue;
      expect(placeholders(arValue), `mismatch at "${path}"`).toEqual(
        placeholders(enValue),
      );
    }
  });

  it("has no empty strings", () => {
    for (const path of arPaths) {
      expect(String(at(ar as Tree, path)).trim(), path).not.toBe("");
      expect(String(at(en as Tree, path)).trim(), path).not.toBe("");
    }
  });
});
