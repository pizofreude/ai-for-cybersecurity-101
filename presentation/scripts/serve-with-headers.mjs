// Serves dist/ on http://127.0.0.1:4322 with the global headers from the Azure Static Web Apps config,
// so the CSP can be tested in a browser before deploying.
// upgrade-insecure-requests and HSTS are dropped locally because the local server is plain HTTP.
import http from "node:http";
import { readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { globalHeaders, readSwaConfig } from "./headers.mjs";

const root = resolve("dist");
const headers = globalHeaders(readSwaConfig());
headers["content-security-policy"] = headers["content-security-policy"].replace(/;\s*upgrade-insecure-requests/, "");
delete headers["strict-transport-security"];
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" };

http
  .createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
    let file = join(root, path);
    if (!file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    try {
      if (statSync(file).isDirectory()) file = join(file, "index.html");
      const body = readFileSync(file);
      res.writeHead(200, { ...headers, "content-type": types[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404, headers).end("Not found");
    }
  })
  .listen(4322, "127.0.0.1", () => console.log("Serving dist/ with staticwebapp.config.json headers on http://127.0.0.1:4322"));
