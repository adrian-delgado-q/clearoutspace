#!/usr/bin/env node
/**
 * bulk-import-listings.js
 *
 * Upload a folder of images to Strapi and create one Listing per image.
 *
 * Filename convention (all parts optional after title):
 *   {title}--{category}--{status}.{ext}
 *
 *   Examples:
 *     "IKEA KALLAX Shelf.jpg"                      → title only
 *     "West Elm Sofa--Furniture.jpg"                → title + category
 *     "Samsung TV--Other--Pending.jpg"              → title + category + status
 *
 * Valid categories : Apartment | Furniture | Estate | Garage | Other
 * Valid statuses   : Available | Pending | Sold   (default: Available)
 *
 * Usage:
 *   node scripts/bulk-import-listings.js \
 *     --folder ./import-images \
 *     --token  your-api-token \
 *     --strapi http://localhost:1337
 *
 * Environment fallbacks:
 *   STRAPI_API_TOKEN      – API token
 *   NEXT_PUBLIC_STRAPI_URL – base URL
 */

import fs from "node:fs";
import path from "node:path";
import { FormData, Blob } from "node:buffer";

// ─── Arg parsing ─────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getArg(flag, fallback = null) {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1]) return args[idx + 1];
    return fallback;
}

const STRAPI_URL = getArg("--strapi") ?? process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const API_TOKEN = getArg("--token") ?? process.env.STRAPI_API_TOKEN ?? "";
const FOLDER = getArg("--folder") ?? "./import-images";
const DEFAULT_CATEGORY = getArg("--category") ?? "Other";
const DEFAULT_STATUS = getArg("--status") ?? "Available";
const DRY_RUN = args.includes("--dry-run");

/** Available Until: default 14 days from today */
function defaultAvailableUntil() {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
}

// ─── Filename parser ──────────────────────────────────────────────────────────

const VALID_CATEGORIES = ["Apartment", "Furniture", "Estate", "Garage", "Other"];
const VALID_STATUSES   = ["Available", "Pending", "Sold"];

function parseFilename(filename) {
    const base = path.basename(filename, path.extname(filename));
    const parts = base.split("--").map((p) => p.trim().replace(/-/g, " "));

    const title    = parts[0] ?? base;
    const category = VALID_CATEGORIES.includes(parts[1]) ? parts[1] : DEFAULT_CATEGORY;
    const status   = VALID_STATUSES.includes(parts[2])   ? parts[2] : DEFAULT_STATUS;

    return { title, category, status };
}

// ─── Strapi API helpers ───────────────────────────────────────────────────────

function authHeaders() {
    const h = { Authorization: `Bearer ${API_TOKEN}` };
    if (!API_TOKEN) delete h.Authorization;
    return h;
}

async function uploadImage(filePath) {
    const filename = path.basename(filePath);
    const data     = fs.readFileSync(filePath);
    const blob     = new Blob([data]);
    const formData = new FormData();
    formData.append("files", blob, filename);

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Upload failed (${res.status}): ${err}`);
    }

    const json = await res.json();
    const file = Array.isArray(json) ? json[0] : json;
    return { id: file.id, url: file.url };
}

async function createListing(data) {
    const res = await fetch(`${STRAPI_URL}/api/listings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify({ data }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Create listing failed (${res.status}): ${err}`);
    }

    return res.json();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

async function run() {
    if (!fs.existsSync(FOLDER)) {
        console.error(`❌  Folder not found: ${FOLDER}`);
        console.error("    Create the folder and add images, or pass --folder <path>");
        process.exit(1);
    }

    const files = fs.readdirSync(FOLDER)
        .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
        .sort();

    if (files.length === 0) {
        console.log(`⚠️  No images found in ${FOLDER}`);
        process.exit(0);
    }

    console.log(`\n🚀  Bulk import  →  ${STRAPI_URL}`);
    console.log(`📁  Folder       →  ${path.resolve(FOLDER)}`);
    console.log(`📦  Images found →  ${files.length}`);
    if (DRY_RUN) console.log("📋  DRY RUN – no requests will be made\n");
    console.log();

    const results = { ok: [], failed: [] };

    for (const file of files) {
        const filePath = path.join(FOLDER, file);
        const { title, category, status } = parseFilename(file);

        console.log(`  ▶ ${file}`);
        console.log(`    title="${title}"  category=${category}  status=${status}`);

        if (DRY_RUN) {
            console.log("    [dry-run] skipping upload + create\n");
            results.ok.push(file);
            continue;
        }

        try {
            // 1. Upload image
            process.stdout.write("    uploading image … ");
            const { id: imageId, url: imageUrl } = await uploadImage(filePath);
            console.log(`✓  (id=${imageId}  url=${imageUrl})`);

            // 2. Create listing
            process.stdout.write("    creating listing … ");
            const result = await createListing({
                title,
                category,
                status,
                availableUntil: defaultAvailableUntil(),
                managedBy: true,
                images: [imageId],
            });

            const listingId = result?.data?.id ?? result?.id;
            console.log(`✓  (listing id=${listingId})\n`);
            results.ok.push(file);
        } catch (err) {
            console.error(`✗  ${err.message}\n`);
            results.failed.push({ file, error: err.message });
        }
    }

    // ── Summary ──────────────────────────────────────────────────────────────
    console.log("─────────────────────────────────────────");
    console.log(`✅  Created  : ${results.ok.length}`);
    if (results.failed.length > 0) {
        console.log(`❌  Failed   : ${results.failed.length}`);
        results.failed.forEach(({ file, error }) => console.log(`    • ${file}: ${error}`));
    }
    console.log("─────────────────────────────────────────\n");

    if (results.failed.length > 0) process.exit(1);
}

run().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
