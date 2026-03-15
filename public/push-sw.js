

const self = globalThis;


self.addEventListener("push", (event) => {
  console.log("Push event received:", event);

  if (!event.data) {
    console.log("No data in push event");
    return;
  }

  try {
    const data = event.data.json();
    console.log("Push data:", data);

    const options = {
      body: data.body || "有新通知",
      icon: data.icon || "/icon.png",
      badge: "/icon.png",
      tag: data.tag || "inventory-notification",
      data: data.data || {},
      vibrate: [200, 100, 200],
      requireInteraction: false,
      actions: [
        { action: "view", title: "查看" },
        { action: "dismiss", title: "关闭" },
      ],
      
      renotify: true,
      persistent: true,
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "库存提醒", options),
    );
  } catch (error) {
    console.error("Error parsing push data:", error);

    
    event.waitUntil(
      self.registration.showNotification("库存提醒", {
        body: event.data.text() || "您有新的库存提醒",
        icon: "/icon.png",
        badge: "/icon.png",
      }),
    );
  }
});


self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      
      for (const client of clientList) {
        if (client.url && "focus" in client) {
          return client.focus();
        }
      }
      
      if (self.clients.openWindow) {
        return self.clients.openWindow("/dashboard/stok");
      }
    }),
  );
});


self.addEventListener("message", (event) => {
  console.log("SW Message:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
