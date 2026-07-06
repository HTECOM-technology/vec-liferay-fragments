/**
 * Upload seed data to Firebase Realtime Database.
 *
 * Usage (from project root):
 *   node src/services/firebase/seed/uploadSeed.js
 *
 * Requires: REACT_APP_FIREBASE_DB_URL set in .env
 *
 * This script writes each collection under the /api node so that
 * firebaseClient can reach them at /api/<collection>.
 */

require("dotenv").config();

const https = require("https");
const http = require("http");
const path = require("path");
const fs = require("fs");

const DB_URL = process.env.REACT_APP_FIREBASE_DB_URL;
if (!DB_URL) {
  console.error("❌  REACT_APP_FIREBASE_DB_URL is not set in .env");
  process.exit(1);
}

// Load seed files: each JSON file = one collection
const seedDir = __dirname;
const seedFiles = fs.readdirSync(seedDir).filter((f) => f.endsWith(".json"));

async function put(urlStr, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const url = new URL(urlStr);
    const lib = url.protocol === "https:" ? https : http;

    const req = lib.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(raw || "null"));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${raw}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  for (const file of seedFiles) {
    const collections = JSON.parse(fs.readFileSync(path.join(seedDir, file), "utf8"));

    for (const [collection, data] of Object.entries(collections)) {
      const endpoint = `${DB_URL}/api/${collection}.json`;
      try {
        await put(endpoint, data);
        console.log(`✅  Uploaded: /api/${collection} (${Object.keys(data).length} items)`);
      } catch (err) {
        console.error(`❌  Failed /api/${collection}: ${err.message}`);
      }
    }
  }
  console.log("\nDone. Firebase data is ready for fake API calls.");
})();
