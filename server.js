import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const port = Number(process.env.PORT) || 3000;
const root = path.dirname(fileURLToPath(import.meta.url));

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function send(
  res,
  statusCode,
  body,
  contentType = "text/plain; charset=utf-8",
) {
  res.writeHead(statusCode, { "Content-Type": contentType });
  res.end(body);
}

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const requested = cleanPath === "/" ? "/index.html" : cleanPath;
  const resolved = path.normalize(path.join(root, requested));

  if (!resolved.startsWith(root)) {
    return null;
  }

  return resolved;
}

const server = http.createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || "/");

  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      send(res, 404, "Not found");
      return;
    }

    const finalPath = stats.isDirectory()
      ? path.join(filePath, "index.html")
      : filePath;

    fs.readFile(finalPath, (readError, data) => {
      if (readError) {
        send(res, 404, "Not found");
        return;
      }

      const ext = path.extname(finalPath).toLowerCase();
      send(res, 200, data, mimeTypes[ext] || "application/octet-stream");
    });
  });
});

server.listen(port, host, () => {
  console.log(`CIMS running at http://${host}:${port}`);
});
