const installEvent = () => {
  self.addEventListener("install", () => {
    console.log("service worker installed!!!!");
  });
};

installEvent();

const activateEvent = () => {
  self.addEventListener("activate", () => {
    console.log("service worker activated!!!");
  });
};

activateEvent();

const cacheName = "v1";

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    }),
  );
});
