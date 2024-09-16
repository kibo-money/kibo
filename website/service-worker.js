// @ts-check

const version = "v1";

self.addEventListener("install", (_event) => {
  const event = /** @type {any} */ (_event);

  event.waitUntil(
    caches.open(version).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/script.js",
        "/packages/solid-signals/2024-04-17/script.js",
        "/packages/ufuzzy/2024-02-21/script.js",
        "/packages/lean-qr/v2.3.4/script.js",
        "/packages/lightweight-charts/v4.2.0/script.js",
        "/fonts/satoshi/2024-09/font.var.woff2",
      ]);
    })
  );
});

self.addEventListener("fetch", (_event) => {
  const event = /** @type {any} */ (_event);

  /** @type {Request} */
  const request = event.request;
  const { url, method } = request;

  event.respondWith(
    caches.match(request).then((cache) => {
      return fetch(request)
        .then((response) => {
          // @ts-ignore
          if (url.includes("/api/")) {
            return response;
          }
          return caches.open(version).then((cache) => {
            if (method === "GET" && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
        .catch(() => {
          return cache;
        });
    })
  );
});
