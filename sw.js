// TruthLynk Service Worker - Push Notifications
const CACHE_NAME = "truthlynk-v1";

// Install
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

// Push notification received
self.addEventListener("push", (e) => {
  let data = { title: "TruthLynk", body: "New gist posted!", icon: "/favicon.svg", badge: "/favicon.svg" };
  try {
    if (e.data) data = { ...data, ...e.data.json() };
  } catch {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/favicon.svg",
      badge: data.badge || "/favicon.svg",
      vibrate: [100, 50, 100],
      data: { url: data.url || "/" },
      actions: [
        { action: "open", title: "Open App" },
        { action: "dismiss", title: "Dismiss" }
      ]
    })
  );
});

// Notification click
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "dismiss") return;
  const url = e.notification.data?.url || "/";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
