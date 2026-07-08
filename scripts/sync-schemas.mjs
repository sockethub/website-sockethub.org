#!/usr/bin/env node
/**
 * Sync the published @sockethub/schemas artifacts into this site's `src/` tree
 * at the exact URL paths their `$id` / `@context` URLs already point at, so
 * sockethub.org actually serves them.
 *
 * The generated artifacts bake absolute sockethub.org URLs into themselves
 * (JSON Schema `$id`, JSON-LD `@context`). The npm `dist/` layout does NOT
 * mirror those URLs — there are three distinct URL prefixes and the platform
 * dir names are percent-encoded for tarball portability. This script performs
 * the dist -> URL mapping and decoding:
 *
 *   dist/schemas/json/<name>.json      -> src/schemas/<version>/<name>.json
 *   dist/contexts/<path>               -> src/ns/context/<path>
 *   dist/schemas/platform/<path>       -> src/schemas/as2/platform/<path>
 *
 * Each path segment is percent-decoded, so the on-disk `sockethub%3Ainternal`
 * (kept encoded in the tarball so `npm install` works on Windows) is served at
 * its canonical `.../platform/sockethub:internal/...` URL.
 *
 * `dist/maps/context-map.json` is intentionally NOT served — it's an internal
 * runtime lookup consumed from the npm package, not referenced by any URL.
 *
 * Idempotency is handled by git: re-running with an already-synced version
 * simply produces no diff, so the deploy workflow commits nothing.
 *
 * Usage:
 *   node scripts/sync-schemas.mjs <version> [options]
 *
 * Options:
 *   --tarball <path>   Use a local .tgz instead of `npm pack` (for CI-from-source / testing)
 *   --alias-latest     Also copy the versioned top-level schemas to src/schemas/v/
 *                      (the unversioned `/v/` placeholder -> latest)
 *   --dry-run          Print the planned copies without writing anything
 */

import { execFileSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
    const opts = { alias: false, dryRun: false, tarball: null, version: null };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--alias-latest") opts.alias = true;
        else if (arg === "--dry-run") opts.dryRun = true;
        else if (arg === "--tarball") opts.tarball = argv[++i];
        else if (arg.startsWith("--"))
            fail(`unknown option: ${arg}`);
        else if (!opts.version) opts.version = arg;
        else fail(`unexpected argument: ${arg}`);
    }
    if (!opts.version) fail("missing <version> argument");
    return opts;
}

function fail(msg) {
    console.error(`sync-schemas: ${msg}`);
    process.exit(1);
}

/**
 * Fetch and extract the published package tarball, returning its `dist/` dir.
 * Retries `npm pack` a few times to ride out npm registry propagation lag right
 * after a release (the same reason the Docker publish job retries).
 */
function extractDist(version, tarballOverride, workDir) {
    let tgz = tarballOverride;
    if (!tgz) {
        const spec = `@sockethub/schemas@${version}`;
        let lastErr;
        for (let attempt = 1; attempt <= 10; attempt++) {
            try {
                const out = execFileSync(
                    "npm",
                    ["pack", spec, "--pack-destination", workDir, "--silent"],
                    { encoding: "utf8" },
                );
                tgz = join(workDir, out.trim().split("\n").pop());
                break;
            } catch (err) {
                lastErr = err;
                console.warn(
                    `  npm pack ${spec} failed (attempt ${attempt}/10); registry may still be propagating…`,
                );
                sleep(20_000);
            }
        }
        if (!tgz) throw lastErr;
    }
    if (!existsSync(tgz)) fail(`tarball not found: ${tgz}`);
    execFileSync("tar", ["-xzf", tgz, "-C", workDir]);
    const dist = join(workDir, "package", "dist");
    if (!existsSync(dist)) fail(`tarball has no package/dist (got ${tgz})`);
    return dist;
}

function sleep(ms) {
    // Busy-free blocking sleep without pulling in async in a linear script.
    execFileSync("sleep", [String(Math.ceil(ms / 1000))]);
}

/** Decode every segment of a relative posix path. */
function decodePath(relPath) {
    return relPath
        .split("/")
        .map((seg) => decodeURIComponent(seg))
        .join("/");
}

/** Recursively list files under `dir`, returned as paths relative to `dir`. */
function listFiles(dir, base = dir) {
    const result = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) result.push(...listFiles(full, base));
        else if (entry.isFile())
            result.push(full.slice(base.length + 1));
    }
    return result;
}

function copyFile(src, dest, dryRun) {
    console.log(
        `  ${dest.slice(ROOT.length + 1)}${dryRun ? "  (dry-run)" : ""}`,
    );
    if (dryRun) return;
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest);
}

function syncTree(srcRoot, destRoot, { decode, dryRun }) {
    if (!existsSync(srcRoot)) return 0;
    const files = listFiles(srcRoot);
    for (const rel of files) {
        const destRel = decode ? decodePath(rel) : rel;
        copyFile(join(srcRoot, rel), join(destRoot, destRel), dryRun);
    }
    return files.length;
}

/**
 * Assert every top-level schema's baked `$id` matches the version dir it will
 * be served from: https://sockethub.org/schemas/<version>/<basename>.
 */
function assertVersionedIds(jsonDir, version) {
    for (const name of readdirSync(jsonDir)) {
        if (!name.endsWith(".json")) continue;
        const doc = JSON.parse(readFileSync(join(jsonDir, name), "utf8"));
        const want = `https://sockethub.org/schemas/${version}/${name}`;
        if (doc.$id !== want) {
            fail(
                `$id mismatch in ${name}: expected "${want}" but schema declares "${doc.$id}". ` +
                    `Refusing to serve a schema at a URL its $id disagrees with.`,
            );
        }
    }
}

function main() {
    const opts = parseArgs(process.argv.slice(2));
    const { version, tarball, alias, dryRun } = opts;

    console.log(`sync-schemas: @sockethub/schemas@${version}`);
    const workDir = mkdtempSync(join(tmpdir(), "sh-schemas-"));
    try {
        const dist = extractDist(version, tarball, workDir);

        // 1. Versioned top-level JSON schemas -> /schemas/<version>/
        //    (absent in pre-config-schema releases; warn and continue).
        const jsonDir = join(dist, "schemas", "json");
        const versionedDest = join(ROOT, "src", "schemas", version);
        let jsonCount = 0;
        if (existsSync(jsonDir)) {
            console.log(`versioned schemas -> src/schemas/${version}/`);
            // Fail loudly if a schema's baked `$id` disagrees with the version
            // dir it's about to be served from — that would publish a schema at
            // a URL whose `$id` points somewhere else (the exact silent drift
            // this whole feature exists to prevent).
            assertVersionedIds(jsonDir, version);
            jsonCount = syncTree(jsonDir, versionedDest, { decode: false, dryRun });
        } else {
            console.warn(
                `  note: this version has no dist/schemas/json (pre-config-schema build); skipping versioned schemas`,
            );
        }

        // 2. JSON-LD contexts -> /ns/context/  (decode encoded platform segs)
        console.log(`contexts -> src/ns/context/`);
        const ctxCount = syncTree(
            join(dist, "contexts"),
            join(ROOT, "src", "ns", "context"),
            { decode: true, dryRun },
        );

        // 3. Per-platform message/credentials schemas -> /schemas/as2/platform/
        console.log(`platform schemas -> src/schemas/as2/platform/`);
        const platCount = syncTree(
            join(dist, "schemas", "platform"),
            join(ROOT, "src", "schemas", "as2", "platform"),
            { decode: true, dryRun },
        );

        // 4. Optional unversioned `/v/` alias -> copy of the latest top-level schemas.
        if (alias && existsSync(jsonDir)) {
            console.log(`alias -> src/schemas/v/  (unversioned -> latest)`);
            const aliasDest = join(ROOT, "src", "schemas", "v");
            if (existsSync(aliasDest) && !dryRun)
                rmSync(aliasDest, { recursive: true, force: true });
            syncTree(jsonDir, aliasDest, { decode: false, dryRun });
        }

        console.log(
            `sync-schemas: done (${jsonCount} versioned, ${ctxCount} contexts, ${platCount} platform schemas)`,
        );
    } finally {
        rmSync(workDir, { recursive: true, force: true });
    }
}

main();
