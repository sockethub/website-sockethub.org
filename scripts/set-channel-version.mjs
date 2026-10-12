#!/usr/bin/env node
/**
 * Update the advertised version for one release channel in release.json.
 *
 * The deploy-schemas workflow calls this with the server release version so the
 * site's advertised version tracks releases automatically. It only touches the
 * version of the named channel — it never flips the active `channel` (promoting
 * next -> stable stays an editorial decision).
 *
 * `alpha` is accepted as a legacy alias for `next`: the core repo's
 * release-publish workflow still sends that name for prereleases.
 *
 * Usage: node scripts/set-channel-version.mjs <channel> <version>
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RELEASE_JSON = join(ROOT, "release.json");

const LEGACY_ALIASES = { alpha: "next" };

const [rawChannel, version] = process.argv.slice(2);
const channel = LEGACY_ALIASES[rawChannel] ?? rawChannel;
if (!rawChannel || !version) {
    console.error("usage: set-channel-version.mjs <channel> <version>");
    process.exit(1);
}

const data = JSON.parse(readFileSync(RELEASE_JSON, "utf8"));
if (!data.channels?.[channel]) {
    console.error(
        `set-channel-version: unknown channel "${channel}" (have: ${Object.keys(
            data.channels ?? {},
        ).join(", ")})`,
    );
    process.exit(1);
}

if (data.channels[channel].version === version) {
    console.log(`release.json: ${channel} already at ${version}`);
    process.exit(0);
}

data.channels[channel].version = version;
writeFileSync(RELEASE_JSON, `${JSON.stringify(data, null, 2)}\n`);
console.log(`release.json: ${channel} -> ${version}`);
