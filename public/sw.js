// Service worker לאפליקציית המשימות.
// אסטרטגיה: ניווטים ברשת-קודם (כדי לקבל גרסה עדכנית), נכסים סטטיים במטמון-קודם.
// המטרה: /tasks תעבוד גם ללא אינטרנט אחרי ביקור ראשון מקוון.

const CACHE = "amonty-tasks-v1";
const SHELL = ["/tasks"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // ניווטים: רשת-קודם, נפילה למטמון (ואם אין — למעטפת /tasks)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match("/tasks"))
        )
    );
    return;
  }

  // נכסים סטטיים: מטמון-קודם, ואם חסר — רשת (ושמירה למטמון)
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached)
    )
  );
});
