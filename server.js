/**
 * Aramex Shipment App - all-in-one local server.
 *
 * Replaces the old two-step setup (run proxy.js, then separately open
 * box_classes.html). This single script does both:
 *   1. Serves the app's own files (box_classes.html, aramex_locations_data.js)
 *      over http://localhost, so the browser and the API calls share the
 *      same origin (no CORS issues at all).
 *   2. Proxies the Aramex API calls that need a server-to-server request
 *      (Aramex doesn't send CORS headers, so a browser can't call it directly).
 *
 * Usage: node server.js
 * Then open: http://localhost:3001
 * (start.bat does both of these steps for you automatically.)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const ARAMEX_BASE = "https://ws.aramex.net/ShippingAPI.V2";
const API_ROUTES = {
  "/api/fetch-cities": "/Location/Service_1_0.svc/json/FetchCities",
  "/api/fetch-states": "/Location/Service_1_0.svc/json/FetchStates",
  "/api/calculate-rate": "/RateCalculator/Service_1_0.svc/json/CalculateRate",
};

const STATIC_DIR = __dirname;
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  let urlPath = req.url.split("?")[0];
  if (urlPath === "/") urlPath = "/box_classes.html";

  const filePath = path.normalize(path.join(STATIC_DIR, decodeURIComponent(urlPath)));
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not found: " + urlPath);
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  // Harmless to keep even though the app and API now share an origin -
  // costs nothing and protects against future changes.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const aramexPath = API_ROUTES[req.url];

  if (req.method === "OPTIONS" && aramexPath) {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "POST" && aramexPath) {
    try {
      const body = await readBody(req);
      const aramexRes = await fetch(`${ARAMEX_BASE}${aramexPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body,
      });
      const rawText = await aramexRes.text();

      // Aramex sometimes returns XML (fault pages, error responses) even on
      // a /json/ endpoint. Detect that instead of blindly forwarding it as
      // "application/json" and crashing the browser's JSON parser.
      let payload;
      try {
        JSON.parse(rawText);
        payload = rawText;
      } catch (parseErr) {
        console.error(`Aramex returned non-JSON for ${aramexPath}:`, rawText.slice(0, 300));
        payload = JSON.stringify({
          HasErrors: true,
          Notifications: [{
            Code: "NON_JSON_RESPONSE",
            Message: "Aramex returned a non-JSON response (likely an XML fault). Raw start: " + rawText.slice(0, 200),
          }],
        });
      }

      res.writeHead(aramexRes.status, { "Content-Type": "application/json" });
      return res.end(payload);
    } catch (err) {
      res.writeHead(502, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ HasErrors: true, Notifications: [{ Message: err.message }] }));
    }
  }

  if (req.method === "GET") {
    return serveStatic(req, res);
  }

  res.writeHead(404);
  res.end("Not found");
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log("=================================================");
  console.log("  Aramex Shipment App is running.");
  console.log("  Open in your browser: http://localhost:" + PORT);
  console.log("  Keep this window open while you use the app.");
  console.log("  Close this window to stop the app.");
  console.log("=================================================");
});
